/**
 * Detects if a string contains LaTeX math expressions
 * @param {string} text - The text to check
 * @returns {boolean} - True if the text contains LaTeX math expressions
 */
export const containsLatex = (text) => {
  if (!text || typeof text !== 'string') return false;
  
  // Common LaTeX delimiters
  const inlineDelimiters = ['$', '\\(', '\\)'];
  const displayDelimiters = ['$$', '\\[', '\\]'];
  
  // Check for inline delimiters
  for (const delimiter of inlineDelimiters) {
    if (text.includes(delimiter)) return true;
  }
  
  // Check for display delimiters
  for (const delimiter of displayDelimiters) {
    if (text.includes(delimiter)) return true;
  }
  
  // Check for common LaTeX commands
  const latexCommands = [
    '\\frac', '\\sqrt', '\\sum', '\\int', '\\prod', 
    '\\alpha', '\\beta', '\\gamma', '\\delta', '\\theta',
    '\\pi', '\\sigma', '\\omega', '\\infty', '\\partial',
    '\\nabla', '\\times', '\\cdot', '\\div', '\\approx',
    '\\neq', '\\geq', '\\leq', '\\in', '\\subset'
  ];
  
  for (const command of latexCommands) {
    if (text.includes(command)) return true;
  }
  
  return false;
};

/**
 * Processes text to ensure LaTeX expressions are properly formatted
 * @param {string} text - The text to process
 * @returns {string} - The processed text
 */
export const processLatex = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // If the text doesn't contain LaTeX, return it as is
  if (!containsLatex(text)) return text;
  
  // Replace LaTeX expressions with properly formatted ones
  let processedText = text;
  
  // Fix inline math expressions without adding extra spaces
  // This ensures that math expressions don't cause line breaks
  processedText = processedText.replace(/\$(.*?)\$/g, (match, p1) => {
    return `$${p1}$`;
  });
  
  // Ensure display math expressions are properly formatted
  processedText = processedText.replace(/\$\$(.*?)\$\$/g, (match, p1) => {
    return `\n$$${p1}$$\n`;
  });
  
  return processedText;
};

export default {
  containsLatex,
  processLatex
}; 