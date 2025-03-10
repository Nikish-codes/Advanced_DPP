import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { fetchQuestion } from '../../store/questionSlice';
import { submitAnswer } from '../../store/questionSlice';
import { setShowSolution } from '../../store/uiSlice';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { getUserAnswer } from '../../utils/localStorage';

const QuestionDetail = () => {
  const { moduleId, chapterId, questionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentQuestion, questions, loading } = useSelector((state) => state.questions);
  const { showSolution } = useSelector((state) => state.ui);
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numericalAnswer, setNumericalAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Load the question
  useEffect(() => {
    dispatch(fetchQuestion({ moduleId, chapterId, questionId }));
    dispatch(setShowSolution(false));
    
    // Check if the question has been attempted before
    const savedAnswer = getUserAnswer(questionId);
    if (savedAnswer) {
      if (Array.isArray(savedAnswer)) {
        setSelectedOptions(savedAnswer);
      } else {
        setNumericalAnswer(savedAnswer);
      }
    }
  }, [dispatch, moduleId, chapterId, questionId]);
  
  // Find the current question index
  const currentIndex = questions.findIndex(q => q.question_id === questionId);
  
  // Handle option selection for multiple choice questions
  const handleOptionSelect = (optionId) => {
    if (isSubmitted) return;
    
    if (currentQuestion.type === 'singleCorrect') {
      setSelectedOptions([optionId]);
    } else if (currentQuestion.type === 'multipleCorrect') {
      if (selectedOptions.includes(optionId)) {
        setSelectedOptions(selectedOptions.filter(id => id !== optionId));
      } else {
        setSelectedOptions([...selectedOptions, optionId]);
      }
    }
  };
  
  // Handle numerical answer input
  const handleNumericalInput = (e) => {
    if (isSubmitted) return;
    setNumericalAnswer(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (!currentQuestion) return;
    
    let correct = false;
    let answer;
    
    if (currentQuestion.type === 'numerical') {
      // For numerical questions, check if the answer matches the correct value
      correct = numericalAnswer === currentQuestion.correctValue;
      answer = numericalAnswer;
    } else if (currentQuestion.type === 'singleCorrect' || currentQuestion.type === 'multipleCorrect') {
      // For multiple choice questions, check if all correct options are selected
      const correctOptionIds = currentQuestion.options
        .filter(option => option.isCorrect)
        .map(option => option.id);
      
      // Check if selected options match correct options
      correct = 
        selectedOptions.length === correctOptionIds.length && 
        selectedOptions.every(id => correctOptionIds.includes(id));
      
      answer = selectedOptions;
    }
    
    // Dispatch action to save the answer
    dispatch(submitAnswer({
      questionId: currentQuestion.question_id,
      answer,
      isCorrect: correct
    }));
    
    setIsSubmitted(true);
    setIsCorrect(correct);
    dispatch(setShowSolution(true));
  };
  
  // Navigate to the next or previous question
  const navigateQuestion = (direction) => {
    if (!questions.length) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
      const nextQuestion = questions[newIndex];
      navigate(`/module/${moduleId}/chapter/${chapterId}/question/${nextQuestion.question_id}`);
    }
  };
  
  // Render LaTeX and HTML content safely
  const renderContent = (content) => {
    if (!content) return null;
    
    // For simplicity, just render the content without LaTeX processing for now
    return (
      <div 
        className="question-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };
  
  if (loading || !currentQuestion) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold text-text">Question {currentIndex + 1}</h2>
          <div className="flex space-x-2">
            {renderDifficultyBadge(currentQuestion.level)}
            {renderTypeBadge(currentQuestion.type)}
          </div>
        </div>
        
        <div className="mb-6">
          {renderContent(currentQuestion.question.text)}
          
          {currentQuestion.question.image && (
            <div className="mt-4">
              <img 
                src={currentQuestion.question.image} 
                alt="Question" 
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </div>
        
        {/* Options or Numerical Input */}
        <div className="mb-6">
          {(currentQuestion.type === 'singleCorrect' || currentQuestion.type === 'multipleCorrect') && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-text mb-2">
                {currentQuestion.type === 'singleCorrect' ? 'Select the correct option:' : 'Select all correct options:'}
              </h3>
              
              {currentQuestion.options.map((option) => (
                <div 
                  key={option.id}
                  className={`p-3 rounded-md cursor-pointer border ${
                    selectedOptions.includes(option.id)
                      ? 'border-accent bg-accent bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600'
                  } ${
                    showSolution && option.isCorrect ? 'border-green-500 bg-green-500 bg-opacity-10' : ''
                  } ${
                    showSolution && selectedOptions.includes(option.id) && !option.isCorrect
                      ? 'border-red-500 bg-red-500 bg-opacity-10'
                      : ''
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex items-start">
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full border mr-3 flex-shrink-0 ${
                      selectedOptions.includes(option.id)
                        ? 'border-accent bg-accent text-white'
                        : 'border-gray-600'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      {renderContent(option.text)}
                      
                      {option.image && (
                        <div className="mt-2">
                          <img 
                            src={option.image} 
                            alt={`Option ${option.id}`} 
                            className="max-w-full h-auto rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === 'numerical' && (
            <div>
              <h3 className="text-lg font-medium text-text mb-2">Enter your answer:</h3>
              <input
                type="text"
                value={numericalAnswer}
                onChange={handleNumericalInput}
                disabled={isSubmitted}
                className="w-full bg-primary border border-gray-700 rounded-md px-4 py-2 text-text focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Enter numerical value"
              />
              
              {showSolution && (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Correct answer:</span> {currentQuestion.correctValue}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        {!isSubmitted ? (
          <Button
            onClick={handleSubmit}
            disabled={
              (currentQuestion.type !== 'numerical' && selectedOptions.length === 0) ||
              (currentQuestion.type === 'numerical' && !numericalAnswer)
            }
            fullWidth
          >
            Submit Answer
          </Button>
        ) : (
          <div className={`p-3 rounded-md text-center font-medium ${
            isCorrect ? 'bg-green-500 bg-opacity-20 text-green-500' : 'bg-red-500 bg-opacity-20 text-red-500'
          }`}>
            {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
          </div>
        )}
      </Card>
      
      {/* Solution */}
      {showSolution && currentQuestion.solution && (
        <Card title="Solution" className="mb-6">
          {renderContent(currentQuestion.solution.text)}
          
          {currentQuestion.solution.image && (
            <div className="mt-4">
              <img 
                src={currentQuestion.solution.image} 
                alt="Solution" 
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}
        </Card>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="secondary"
          onClick={() => navigateQuestion(-1)}
          disabled={currentIndex === 0}
        >
          Previous Question
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => navigateQuestion(1)}
          disabled={currentIndex === questions.length - 1}
        >
          Next Question
        </Button>
      </div>
    </div>
  );
};

// Helper function to render difficulty badge
const renderDifficultyBadge = (level) => {
  const colors = {
    1: 'bg-green-500',
    2: 'bg-yellow-500',
    3: 'bg-red-500',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[level]} text-white`}>
      Level {level}
    </span>
  );
};

// Helper function to render question type badge
const renderTypeBadge = (type) => {
  const types = {
    singleCorrect: 'Single Correct',
    multipleCorrect: 'Multiple Correct',
    numerical: 'Numerical',
    subjective: 'Subjective',
  };
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-700 text-text-secondary">
      {types[type] || type}
    </span>
  );
};

export default QuestionDetail; 