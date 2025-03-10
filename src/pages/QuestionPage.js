import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchQuestion, submitAnswer } from '../store/questionSlice';
import Layout from '../components/Layout';
import QuestionContent from '../components/QuestionContent';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const QuestionPage = () => {
  const { subjectId, chapterId, questionId } = useParams();
  const dispatch = useDispatch();
  const { modules, chapters } = useSelector((state) => state.modules);
  const { currentQuestion, loading, questions } = useSelector((state) => state.questions);
  
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [numericalAnswer, setNumericalAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(null); // For partial marking in multiple correct
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);
  
  const currentModule = modules.find(module => module.id === subjectId);
  const currentChapters = chapters[subjectId] || [];
  const currentChapter = currentChapters.find(chapter => chapter.id === chapterId);
  
  // Find the current question index in the questions array
  const currentIndex = questions.findIndex(q => q.question_id === questionId || q.id === questionId);
  
  useEffect(() => {
    if (subjectId && chapterId && questionId) {
      dispatch(fetchQuestion({ 
        moduleId: subjectId, 
        chapterId, 
        questionId 
      }));
    }
    
    // Reset state when question changes
    setSelectedOptions([]);
    setNumericalAnswer('');
    setShowSolution(false);
    setIsCorrect(null);
    setScore(null);
    setTime(0);
    
    // Start timer
    startTimer();
    
    // Scroll to top when navigating to a new question
    window.scrollTo(0, 0);
    
    // Clean up timer on unmount or when question changes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dispatch, subjectId, chapterId, questionId]);
  
  // Prevent auto-scrolling issue
  useEffect(() => {
    // Store the current scroll position
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Start the timer
  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setTime(0);
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
      
      // Restore scroll position if it changed unexpectedly
      if (scrollRef.current !== undefined && window.scrollY !== scrollRef.current) {
        window.scrollTo(0, scrollRef.current);
      }
    }, 1000);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Helper function to get question text
  const getQuestionText = () => {
    if (!currentQuestion) return '';
    return currentQuestion.question_text || 
           (currentQuestion.question && currentQuestion.question.text) || 
           '';
  };
  
  // Helper function to get question options
  const getQuestionOptions = () => {
    if (!currentQuestion) return {};
    
    // Handle different option formats
    let options = currentQuestion.options || 
                  (currentQuestion.question && currentQuestion.question.options) || 
                  {};
    
    // Check if options is an array (some formats might use arrays)
    if (Array.isArray(options)) {
      // Convert array to object with keys A, B, C, D...
      const optionsObj = {};
      const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      options.forEach((option, index) => {
        if (index < keys.length) {
          optionsObj[keys[index]] = option;
        }
      });
      return optionsObj;
    }
    
    // If options is already an object with numeric keys, convert to letter keys
    if (typeof options === 'object' && options !== null) {
      const numericKeys = Object.keys(options).filter(key => !isNaN(parseInt(key)));
      if (numericKeys.length > 0) {
        const optionsObj = {};
        const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        numericKeys.forEach((key, index) => {
          if (index < keys.length) {
            optionsObj[keys[index]] = options[key];
          }
        });
        return optionsObj;
      }
    }
    
    return options;
  };
  
  // Helper function to get correct answer
  const getCorrectAnswer = () => {
    if (!currentQuestion) return '';
    
    let answer = currentQuestion.correct_answer || 
                 currentQuestion.correct_value || 
                 '';
    
    // If answer is a number (like 0, 1, 2, 3), convert to letter (A, B, C, D)
    if (!isNaN(parseInt(answer)) && answer.toString().match(/^[0-3]$/)) {
      const index = parseInt(answer);
      const letters = ['A', 'B', 'C', 'D'];
      if (index >= 0 && index < letters.length) {
        return letters[index];
      }
    }
    
    // Handle array of correct answers for multiple correct questions
    if (Array.isArray(answer)) {
      return answer.map(ans => {
        if (!isNaN(parseInt(ans)) && ans.toString().match(/^[0-3]$/)) {
          const index = parseInt(ans);
          const letters = ['A', 'B', 'C', 'D'];
          if (index >= 0 && index < letters.length) {
            return letters[index];
          }
        }
        return ans;
      });
    }
    
    return answer;
  };
  
  // Helper function to get explanation/solution
  const getExplanation = () => {
    if (!currentQuestion) return '';
    return currentQuestion.explanation || 
           currentQuestion.solution_text || 
           (currentQuestion.solution && currentQuestion.solution.text) || 
           '';
  };
  
  // Helper function to get question type
  const getQuestionType = () => {
    if (!currentQuestion) return 'mcq';
    return currentQuestion.type || 'mcq';
  };
  
  const handleOptionSelect = (option) => {
    if (isCorrect !== null) return; // Don't allow changing after submission
    
    const questionType = getQuestionType();
    
    if (questionType === 'multipleCorrect') {
      // For multiple correct questions, toggle the option
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(opt => opt !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      // For single correct questions, just set the option
      setSelectedOptions([option]);
    }
  };
  
  const handleNumericalInputChange = (e) => {
    if (isCorrect !== null) return; // Don't allow changing after submission
    
    // Only allow numbers, decimal point, and minus sign
    const value = e.target.value;
    if (/^-?\d*\.?\d*$/.test(value) || value === '') {
      setNumericalAnswer(value);
    }
  };
  
  const handleSubmit = () => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const questionType = getQuestionType();
    
    // For MCQ questions
    if (questionType === 'mcq' || questionType === 'singleCorrect') {
      if (selectedOptions.length === 0 || isCorrect !== null) return;
      
      const correct = selectedOptions[0] === getCorrectAnswer();
      setIsCorrect(correct);
      setScore(correct ? 4 : -1); // +4 for correct, -1 for incorrect
      setShowSolution(true);
      
      dispatch(submitAnswer({
        questionId: currentQuestion.question_id || questionId,
        answer: selectedOptions[0],
        isCorrect: correct,
        score: correct ? 4 : -1
      }));
    }
    // For multiple correct questions
    else if (questionType === 'multipleCorrect') {
      if (selectedOptions.length === 0 || isCorrect !== null) return;
      
      const correctAnswers = Array.isArray(getCorrectAnswer()) ? getCorrectAnswer() : [getCorrectAnswer()];
      
      // Check if any incorrect option is selected
      const hasIncorrectSelection = selectedOptions.some(opt => !correctAnswers.includes(opt));
      
      // Check if all correct options are selected
      const allCorrectSelected = correctAnswers.every(opt => selectedOptions.includes(opt));
      
      // Calculate score according to JEE Advanced marking scheme
      let calculatedScore = 0;
      let isAnswerCorrect = false;
      
      if (hasIncorrectSelection) {
        // Negative marking if any incorrect option is selected
        calculatedScore = -2;
        isAnswerCorrect = false;
      } else if (allCorrectSelected) {
        // Full marks if all correct options are selected and no incorrect ones
        calculatedScore = 4;
        isAnswerCorrect = true;
      } else {
        // Partial marks if some correct options are selected and no incorrect ones
        // Calculate based on the proportion of correct answers selected
        const partialScore = Math.floor((selectedOptions.length / correctAnswers.length) * 4);
        calculatedScore = partialScore > 0 ? partialScore : 0;
        isAnswerCorrect = false;
      }
      
      setIsCorrect(isAnswerCorrect);
      setScore(calculatedScore);
      setShowSolution(true);
      
      dispatch(submitAnswer({
        questionId: currentQuestion.question_id || questionId,
        answer: selectedOptions,
        isCorrect: isAnswerCorrect,
        score: calculatedScore
      }));
    }
    // For numerical questions
    else if (questionType === 'numerical') {
      if (!numericalAnswer || isCorrect !== null) return;
      
      // Compare with a tolerance for floating point
      const userAnswer = parseFloat(numericalAnswer);
      const correctAnswer = parseFloat(getCorrectAnswer());
      const tolerance = 0.001; // Small tolerance for floating point comparison
      
      const correct = Math.abs(userAnswer - correctAnswer) < tolerance;
      setIsCorrect(correct);
      setScore(correct ? 4 : 0); // +4 for correct, 0 for incorrect (no negative marking)
      setShowSolution(true);
      
      dispatch(submitAnswer({
        questionId: currentQuestion.question_id || questionId,
        answer: numericalAnswer,
        isCorrect: correct,
        score: correct ? 4 : 0
      }));
    }
  };
  
  // Helper function to format option content
  const formatOptionContent = (content) => {
    if (!content) return '';
    
    // If content is a string, return it directly
    if (typeof content === 'string') {
      return content;
    }
    
    // If content is an object with a text property, return that
    if (typeof content === 'object' && content !== null) {
      if (content.text) {
        return content.text;
      }
      
      // If content has an image property, create HTML with the image
      if (content.image) {
        return `<img src="${content.image}" alt="Option image" class="option-image" />`;
      }
      
      // Try to convert object to string in a readable way
      try {
        return JSON.stringify(content);
      } catch (e) {
        return String(content);
      }
    }
    
    // Default: convert to string
    return String(content);
  };
  
  // Navigate to the next or previous question
  const navigateToQuestion = (direction) => {
    if (!questions || questions.length === 0) return;
    
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < questions.length) {
      const nextQuestion = questions[newIndex];
      const nextQuestionId = nextQuestion.question_id || nextQuestion.id;
      return `/subjects/${subjectId}/chapters/${chapterId}/questions/${nextQuestionId}`;
    }
    return null;
  };
  
  if (!currentModule || !currentChapter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Question not found</h1>
          <Button asChild variant="outline">
            <Link to={`/subjects/${subjectId}`}>
              &larr; Back to {currentModule ? currentModule.title : 'Subject'}
            </Link>
          </Button>
      </div>
      </Layout>
    );
  }
  
  // Check if the question is multiple choice
  const isMultipleChoice = getQuestionType() === 'multipleCorrect';
  
  // Get correct answers for display
  const correctAnswers = Array.isArray(getCorrectAnswer()) ? getCorrectAnswer() : [getCorrectAnswer()];
  
  return (
    <Layout>
      <div className="mb-8 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" className="group">
            <Link to={`/subjects/${subjectId}/chapters/${chapterId}`} className="flex items-center space-x-2">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              >
                <path d="m15 18-6-6 6-6"/>
              </svg>
              <span>Back to {currentChapter.title}</span>
            </Link>
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Time:</span>
            <Badge variant="outline" className="bg-secondary/20 text-foreground">
              {formatTime(time)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Question</h1>
          <div className="flex items-center space-x-2">
            {currentQuestion && currentQuestion.level && (
              <Badge variant={
                currentQuestion.level === 1 ? "success" : 
                currentQuestion.level === 2 ? "warning" : "error"
              }>
                Level {currentQuestion.level}
              </Badge>
            )}
            <Badge variant="outline">
              {getQuestionType() === 'numerical' ? 'Numerical' : 
               getQuestionType() === 'multipleCorrect' ? 'Multiple Correct' : 
               'Single Correct'}
            </Badge>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : currentQuestion ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Question</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <QuestionContent content={getQuestionText()} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {getQuestionType() === 'numerical' ? 'Enter your answer' : 
                   isMultipleChoice ? 'Select all correct options' : 'Select the correct option'}
                </CardTitle>
                {isMultipleChoice && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: Full marks for selecting all correct options only. Partial marks for selecting some correct options. 
                    Negative marks for selecting any incorrect option.
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {getQuestionType() === 'numerical' ? (
                  // Numerical input
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={numericalAnswer}
                      onChange={handleNumericalInputChange}
                      disabled={isCorrect !== null}
                      placeholder="Enter your numerical answer"
                      className="input w-full"
                    />
                    {isCorrect !== null && (
                      <div className={`text-sm ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                        {isCorrect ? (
                          'Correct!'
                        ) : (
                          <div className="space-y-1">
                            <div>Incorrect.</div>
                            <div className="font-medium">
                              The correct answer is: <span className="bg-success/10 text-success px-2 py-1 rounded">{getCorrectAnswer()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Multiple choice options
                  <div className="space-y-3">
                    {Object.entries(getQuestionOptions()).map(([key, value]) => {
                      const isSelected = selectedOptions.includes(key);
                      const isCorrectAnswer = correctAnswers.includes(key);
                      const showResult = isCorrect !== null;
                      
                      let optionClass = "relative flex items-start space-x-3 rounded-lg border p-4 cursor-pointer transition-all";
                      
                      if (showResult) {
                        if (isCorrectAnswer) {
                          optionClass += " border-success bg-success/5";
                        } else if (isSelected && !isCorrectAnswer) {
                          optionClass += " border-destructive bg-destructive/5";
                        } else {
                          optionClass += " border-border";
                        }
                      } else if (isSelected) {
                        optionClass += " border-primary bg-primary/5";
                      } else {
                        optionClass += " border-border hover:border-primary hover:bg-primary/5";
                      }
                      
                      return (
                        <div 
                          key={key} 
                          className={optionClass}
                          onClick={() => handleOptionSelect(key)}
                        >
                          <div className="flex-shrink-0">
                            <div className={`flex h-6 w-6 items-center justify-center rounded-${isMultipleChoice ? 'md' : 'full'} border ${
                              isSelected ? 'border-primary bg-primary text-primary-foreground' : 
                              (showResult && isCorrectAnswer) ? 'border-success bg-success text-success-foreground' : 'border-border'
                            }`}>
                              {isMultipleChoice ? (
                                isSelected ? (
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                ) : (showResult && isCorrectAnswer) ? (
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className="h-4 w-4" 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path 
                                      fillRule="evenodd" 
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                      clipRule="evenodd" 
                                    />
                                  </svg>
                                ) : null
                              ) : (showResult && isCorrectAnswer) ? (
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  className="h-4 w-4" 
                                  viewBox="0 0 20 20" 
                                  fill="currentColor"
                                >
                                  <path 
                                    fillRule="evenodd" 
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                                    clipRule="evenodd" 
                                  />
                                </svg>
                              ) : key}
                            </div>
                          </div>
                          <div className="flex-grow option-content-wrapper overflow-x-auto">
                            <QuestionContent content={formatOptionContent(value)} />
                          </div>
                          {showResult && isCorrectAnswer && (
                            <div className="absolute right-4 top-4 text-success">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="h-5 w-5"
                              >
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                <polyline points="22 4 12 14.01 9 11.01"/>
                              </svg>
                            </div>
                          )}
                          {showResult && isSelected && !isCorrectAnswer && (
                            <div className="absolute right-4 top-4 text-destructive">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="h-5 w-5"
                              >
                                <circle cx="12" cy="12" r="10"/>
                                <line x1="15" y1="9" x2="9" y2="15"/>
                                <line x1="9" y1="9" x2="15" y2="15"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSubmit}
                  disabled={(getQuestionType() === 'numerical' && !numericalAnswer) || 
                           (getQuestionType() !== 'numerical' && selectedOptions.length === 0) || 
                           isCorrect !== null}
                >
                  {isCorrect !== null ? 'Submitted' : 'Submit Answer'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    disabled={currentIndex <= 0}
                  >
                    <Link 
                      to={navigateToQuestion(-1) || "#"} 
                      className="flex items-center space-x-2"
                      onClick={(e) => !navigateToQuestion(-1) && e.preventDefault()}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4"
                      >
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                      <span>Previous</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                    disabled={currentIndex >= questions.length - 1}
                  >
                    <Link 
                      to={navigateToQuestion(1) || "#"} 
                      className="flex items-center space-x-2"
                      onClick={(e) => !navigateToQuestion(1) && e.preventDefault()}
                    >
                      <span>Next</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4"
                      >
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Solution</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                {showSolution ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-md ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="h-5 w-5"
                            >
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                              <polyline points="22 4 12 14.01 9 11.01"/>
                            </svg>
                            <span className="font-medium">Correct Answer!</span>
                          </>
                        ) : (
                          <>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" 
                              height="24" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              className="h-5 w-5"
                            >
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="15" y1="9" x2="9" y2="15"/>
                              <line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                            <span className="font-medium">Incorrect Answer</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        {isCorrect ? 
                          'Great job! You selected the correct answer.' : 
                          <>
                            <div>The correct answer is:</div>
                            {getQuestionType() === 'numerical' ? (
                              <div className="font-medium mt-1 text-base">{getCorrectAnswer()}</div>
                            ) : isMultipleChoice ? (
                              <div className="mt-1">
                                {correctAnswers.map((option, index) => (
                                  <span key={option} className="inline-block bg-success/10 text-success px-2 py-1 rounded mr-2 mb-1 font-medium">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="font-medium mt-1 text-base">{getCorrectAnswer()}</div>
                            )}
                          </>
                        }
                      </div>
                      {score !== null && (
                        <div className="mt-2 text-sm font-medium">
                          Score: {score > 0 ? `+${score}` : score}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Explanation:</h4>
                      <QuestionContent content={getExplanation()} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/20 p-4 rounded-md text-center text-muted-foreground">
                    Submit your answer to see the solution.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
    </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Question not found.</p>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
};

export default QuestionPage; 