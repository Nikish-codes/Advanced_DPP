import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../store/questionSlice';
import Layout from '../components/Layout';
import MathContent from '../components/MathContent';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getAttemptedQuestions } from '../utils/localStorage';

const ChapterPage = () => {
  const { subjectId, chapterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modules, chapters, dataSource } = useSelector((state) => state.modules);
  const { questions, loading } = useSelector((state) => state.questions);
  
  // State for filters and sorting
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [attemptFilter, setAttemptFilter] = useState('all');
  
  // State for expandable panels
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const currentModule = modules.find(module => module.id === subjectId);
  const currentChapters = chapters[subjectId] || [];
  const currentChapter = currentChapters.find(chapter => chapter.id === chapterId);
  
  // Get attempted questions data
  const attemptedQuestions = getAttemptedQuestions(dataSource);
  
  useEffect(() => {
    if (subjectId && chapterId) {
      dispatch(fetchQuestions({ moduleId: subjectId, chapterId }));
    }
  }, [dispatch, subjectId, chapterId]);
  
  // Apply filters and sorting whenever questions, filters, or sort options change
  useEffect(() => {
    if (!questions || questions.length === 0) {
      setFilteredQuestions([]);
      return;
    }
    
    let result = [...questions];
    
    // Apply difficulty filter
    if (difficultyFilter !== 'all') {
      const level = parseInt(difficultyFilter);
      result = result.filter(q => q.level === level);
    }
    
    // Apply question type filter
    if (typeFilter !== 'all') {
      result = result.filter(q => {
        const questionType = q.type || 'mcq';
        
        if (typeFilter === 'singleCorrect') {
          return questionType === 'mcq' || questionType === 'singleCorrect';
        } else if (typeFilter === 'multipleCorrect') {
          return questionType === 'multipleCorrect';
        } else if (typeFilter === 'numerical') {
          return questionType === 'numerical';
        }
        
        return true;
      });
    }
    
    // Apply attempt filter
    if (attemptFilter !== 'all') {
      result = result.filter(q => {
        const isAttempted = attemptedQuestions[q.question_id];
        
        switch (attemptFilter) {
          case 'attempted':
            return isAttempted;
          case 'unattempted':
            return !isAttempted;
          case 'incorrect':
            return isAttempted && !isAttempted.isCorrect;
          default:
            return true;
        }
      });
    }
    
    // Apply search filter if there's a query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q => {
        const questionText = getQuestionPreview(q).toLowerCase();
        return questionText.includes(query);
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'difficulty-asc':
        result.sort((a, b) => (a.level || 1) - (b.level || 1));
        break;
      case 'difficulty-desc':
        result.sort((a, b) => (b.level || 1) - (a.level || 1));
        break;
      default:
        // Default sorting (by index/id)
        break;
    }
    
    setFilteredQuestions(result);
  }, [questions, difficultyFilter, typeFilter, sortOption, searchQuery, attemptFilter, attemptedQuestions]);
  
  if (!currentModule || !currentChapter) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Button asChild variant="outline">
            <Link to={`/subjects/${subjectId}`}>
              &larr; Back to {currentModule ? currentModule.title : 'Subject'}
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Helper function to safely extract text from question
  const getQuestionPreview = (question) => {
    if (!question) return 'No question text available';
    
    // Handle different question structures
    const questionText = question.question_text || 
                         (question.question && question.question.text) || 
                         'No question text available';
    
    return questionText.toString();
  };
  
  // Helper function to get question type
  const getQuestionType = (question) => {
    if (!question) return 'mcq';
    return question.type || 'mcq';
  };
  
  // Handle filter and sort changes
  const handleDifficultyChange = (e) => {
    setDifficultyFilter(e.target.value);
  };
  
  const handleTypeChange = (e) => {
    setTypeFilter(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleAttemptFilterChange = (e) => {
    setAttemptFilter(e.target.value);
  };
  
  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };
  
  const resetFilters = () => {
    setDifficultyFilter('all');
    setTypeFilter('all');
    setSortOption('default');
    setSearchQuery('');
    setAttemptFilter('all');
  };
  
  // Handle question click
  const handleQuestionClick = (questionId) => {
    navigate(`/subjects/${subjectId}/chapters/${chapterId}/questions/${questionId}`);
  };
  
  return (
    <Layout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Button asChild variant="ghost" className="group w-full">
            <Link to={`/subjects/${subjectId}`} className="flex items-center space-x-2 w-full">
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
              <span>Back to {currentModule.title}</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">{currentChapter.title}</h1>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : questions.length > 0 ? (
        <>
          {/* Filter Toggle Button */}
          <Card className="mb-4 p-4">
            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">Showing {filteredQuestions.length} of {questions.length} questions</span>
                {(difficultyFilter !== 'all' || typeFilter !== 'all' || sortOption !== 'default' || searchQuery) && (
                  <span className="ml-2 text-muted-foreground">
                    (Filtered)
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                {(difficultyFilter !== 'all' || typeFilter !== 'all' || sortOption !== 'default' || searchQuery) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="w-full cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleFilterPanel}
                  className="flex items-center space-x-1 w-full cursor-pointer"
                >
                  <span>{isFilterPanelOpen ? 'Hide Filters' : 'Show Filters'}</span>
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
                    className={`h-4 w-4 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Expandable Filters Panel */}
          {isFilterPanelOpen && (
            <Card className="mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select 
                    value={difficultyFilter} 
                    onChange={handleDifficultyChange}
                    className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Levels</option>
                    <option value="1">Level 1 (Easy)</option>
                    <option value="2">Level 2 (Medium)</option>
                    <option value="3">Level 3 (Hard)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Question Type</label>
                  <select 
                    value={typeFilter} 
                    onChange={handleTypeChange}
                    className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    <option value="singleCorrect">Single Correct</option>
                    <option value="multipleCorrect">Multiple Correct</option>
                    <option value="numerical">Numerical</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Attempt Status</label>
                  <select 
                    value={attemptFilter} 
                    onChange={handleAttemptFilterChange}
                    className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Questions</option>
                    <option value="attempted">Attempted</option>
                    <option value="unattempted">Not Attempted</option>
                    <option value="incorrect">Incorrect Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Sort By</label>
                  <select 
                    value={sortOption} 
                    onChange={handleSortChange}
                    className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="default">Default Order</option>
                    <option value="difficulty-asc">Difficulty (Low to High)</option>
                    <option value="difficulty-desc">Difficulty (High to Low)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Search</label>
                  <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={handleSearchChange}
                    placeholder="Search questions..."
                    className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </Card>
          )}
          
          {filteredQuestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredQuestions.map((question, index) => {
                const isAttempted = attemptedQuestions[question.question_id];
                const isCorrect = isAttempted?.isCorrect;
                
                return (
                  <Card 
                    key={question.question_id || index} 
                    className={`transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary ${
                      isAttempted ? 'opacity-70' : ''
                    } cursor-pointer`}
                    onClick={() => handleQuestionClick(question.question_id || index)}
                  >
                    <div className="p-4 block h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Question {questions.indexOf(question) + 1}</span>
                        <div className="flex items-center space-x-2">
                          {isAttempted && (
                            <Badge variant={isCorrect ? "success" : "destructive"}>
                              {isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                          )}
                          <Badge variant={
                            question.level === 1 ? "success" : 
                            question.level === 2 ? "warning" : "error"
                          }>
                            Level {question.level || 1}
                          </Badge>
                          <Badge variant="outline">
                            {getQuestionType(question) === 'numerical' ? 'Numerical' : 
                             getQuestionType(question) === 'multipleCorrect' ? 'Multiple Correct' : 
                             'Single Correct'}
                          </Badge>
                        </div>
                      </div>
                      <div className="question-preview">
                        <MathContent content={getQuestionPreview(question)} />
                        <div className="fade-overlay"></div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No questions match your filters.</p>
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="w-full cursor-pointer"
              >
                Reset Filters
              </Button>
            </Card>
          )}
        </>
      ) : (
        <Card className="p-6">
          <p className="text-muted-foreground">No questions found for this chapter.</p>
          <div className="mt-4">
            <Button asChild variant="outline" className="w-full">
              <Link to={`/subjects/${subjectId}`} className="flex items-center w-full">
                &larr; Back to {currentModule.title}
              </Link>
            </Button>
          </div>
        </Card>
      )}
    </Layout>
  );
};

export default ChapterPage; 