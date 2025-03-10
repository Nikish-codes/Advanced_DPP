import React from 'react';
import MathContent from './MathContent';

/**
 * Component to safely render question content that may contain HTML and math expressions
 * @param {Object} props - Component props
 * @param {string} props.content - The HTML content to render
 * @param {string} props.className - Additional CSS classes
 */
const QuestionContent = ({ content, className = '' }) => {
  return <MathContent content={content} className={className} />;
};

export default QuestionContent; 