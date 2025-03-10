import React, { useEffect, useRef } from 'react';

const MathJaxRenderer = ({ math, inline = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Skip if no container or no math content
    if (!containerRef.current || !math) return;

    // Load MathJax dynamically
    if (!window.MathJax) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
      script.async = true;
      script.onload = () => {
        // Configure MathJax
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            processEnvironments: true
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
          }
        };
        
        // Render the math
        renderMath();
      };
      document.head.appendChild(script);
    } else {
      // MathJax is already loaded, just render the math
      renderMath();
    }
  }, [math]);

  const renderMath = () => {
    if (!window.MathJax || !window.MathJax.typesetPromise) {
      // MathJax not fully loaded yet, try again in a moment
      setTimeout(renderMath, 100);
      return;
    }

    // Set the content
    if (inline) {
      containerRef.current.innerHTML = `\\(${math}\\)`;
    } else {
      containerRef.current.innerHTML = `\\[${math}\\]`;
    }

    // Typeset the math
    window.MathJax.typesetPromise([containerRef.current]).catch((err) => {
      console.error('MathJax typesetting failed:', err);
    });
  };

  return <span ref={containerRef} className="math-container" />;
};

export default MathJaxRenderer; 