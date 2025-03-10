import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/card';
import { isQuestionAttempted } from '../../utils/localStorage';

const QuestionCard = ({ question, moduleId, chapterId, index }) => {
  const attempted = isQuestionAttempted(question.question_id);
  
  // Get a preview of the question text (strip HTML tags)
  const getQuestionPreview = () => {
    const plainText = question.question.text.replace(/<[^>]*>/g, '');
    return plainText.length > 100 ? `${plainText.substring(0, 100)}...` : plainText;
  };
  
  // Get difficulty level label and color
  const getDifficultyLabel = () => {
    const colors = {
      1: 'bg-green-500',
      2: 'bg-yellow-500',
      3: 'bg-red-500',
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[question.level]} text-white`}>
        Level {question.level}
      </span>
    );
  };
  
  // Get question type label
  const getTypeLabel = () => {
    const types = {
      singleCorrect: 'Single Correct',
      multipleCorrect: 'Multiple Correct',
      numerical: 'Numerical',
      subjective: 'Subjective',
    };
    
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-text-secondary">
        {types[question.type] || question.type}
      </span>
    );
  };
  
  return (
    <Link to={`/module/${moduleId}/chapter/${chapterId}/question/${question.question_id}`}>
      <Card className="hover:border-accent hover:border transition-colors cursor-pointer h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-text">Question {index + 1}</h3>
          {attempted && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-white">
              Attempted
            </span>
          )}
        </div>
        
        <p className="text-text-secondary mb-4">{getQuestionPreview()}</p>
        
        <div className="flex flex-wrap gap-2">
          {getDifficultyLabel()}
          {getTypeLabel()}
        </div>
      </Card>
    </Link>
  );
};

export default QuestionCard; 