import React, { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { processQuestionContent } from '../store/questionSlice';
import { containsLatex, processLatex } from '../utils/mathUtils';

const MathContent = ({ content, className = '' }) => {
  const containerRef = useRef(null);
  const [rendered, setRendered] = useState(false);
  
  // Process the content to ensure proper formatting
  const processedContent = processQuestionContent(content);
  
  // Process LaTeX if present
  const hasLatex = containsLatex(processedContent);
  const latexProcessedContent = hasLatex ? processLatex(processedContent) : processedContent;
  
  // Sanitize the HTML to prevent XSS attacks
  const sanitizedContent = DOMPurify.sanitize(latexProcessedContent, {
    ADD_TAGS: ['img', 'math'],
    ADD_ATTR: ['src', 'alt', 'width', 'height', 'display']
  });
  
  // This effect runs once on mount to set up MathJax observer
  useEffect(() => {
    // Create a mutation observer to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      if (hasLatex && !rendered) {
        renderMath();
      }
    });
    
    // Start observing the container
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true, 
        subtree: true 
      });
    }
    
    // Clean up observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // This effect runs when content changes
  useEffect(() => {
    if (!containerRef.current || !sanitizedContent) return;
    
    // Reset rendered state when content changes
    setRendered(false);
    
    // Only render math if the content contains LaTeX
    if (hasLatex) {
      // Use a timeout to ensure the DOM is updated before rendering
      const timer = setTimeout(() => {
        renderMath();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [sanitizedContent, hasLatex]);
  
  const renderMath = () => {
    // Wait for MathJax to be fully loaded
    if (!window.MathJax || !window.MathJax.typesetPromise) {
      const timer = setTimeout(renderMath, 100);
      return () => clearTimeout(timer);
    }
    
    try {
      // Typeset the math
      window.MathJax.typesetPromise([containerRef.current])
        .then(() => {
          setRendered(true);
        })
        .catch((err) => {
          console.error('MathJax typesetting failed:', err);
        });
    } catch (error) {
      console.error('Error rendering math:', error);
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`math-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default MathContent; 