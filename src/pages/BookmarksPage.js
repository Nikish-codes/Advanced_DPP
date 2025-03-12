import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBookmarkedQuestions, fetchQuestions } from '../store/questionSlice';
import Layout from '../components/Layout';
import MathContent from '../components/MathContent';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const BookmarksPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dataSource } = useSelector((state) => state.modules);
  const { bookmarkedQuestions, loading, questions } = useSelector((state) => state.questions);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [sortOption, setSortOption] = useState('newest');
  
  useEffect(() => {
    dispatch(fetchBookmarkedQuestions());
  }, [dispatch, dataSource]);
  
  useEffect(() => {
    // If we have bookmarks but no questions loaded, fetch them
    if (Object.keys(bookmarkedQuestions).length > 0 && (!questions || questions.length === 0)) {
      // Get the first bookmark's module and chapter IDs
      const firstBookmark = Object.values(bookmarkedQuestions)[0];
      if (firstBookmark?.moduleId && firstBookmark?.chapterId) {
        dispatch(fetchQuestions({ 
          moduleId: firstBookmark.moduleId, 
          chapterId: firstBookmark.chapterId 
        }));
      }
    }
  }, [dispatch, bookmarkedQuestions, questions]);
  
  useEffect(() => {
    // Convert bookmarkedQuestions object to array for easier filtering and sorting
    const bookmarksArray = Object.entries(bookmarkedQuestions).map(([id, data]) => ({
      id,
      ...data
    }));
    
    let result = [...bookmarksArray];
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(bookmark => {
        const questionText = bookmark.question_text?.toLowerCase() || '';
        const moduleName = bookmark.moduleName?.toLowerCase() || '';
        const chapterName = bookmark.chapterName?.toLowerCase() || '';
        
        return (
          questionText.includes(query) || 
          moduleName.includes(query) || 
          chapterName.includes(query)
        );
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'newest':
        result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        break;
      case 'oldest':
        result.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        break;
      case 'moduleAZ':
        result.sort((a, b) => {
          const moduleA = a.moduleName || '';
          const moduleB = b.moduleName || '';
          return moduleA.localeCompare(moduleB);
        });
        break;
      case 'moduleZA':
        result.sort((a, b) => {
          const moduleA = a.moduleName || '';
          const moduleB = b.moduleName || '';
          return moduleB.localeCompare(moduleA);
        });
        break;
      default:
        break;
    }
    
    setFilteredBookmarks(result);
  }, [bookmarkedQuestions, searchQuery, sortOption]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleQuestionClick = (bookmark) => {
    const subjectSlug = bookmark.moduleName?.toLowerCase().replace(/\s+/g, '-');
    const chapterSlug = bookmark.chapterName?.toLowerCase().replace(/\s+/g, '-');
    const questionNumber = questions?.findIndex(q => q.question_id === bookmark.id) + 1 || 1;
    navigate(`/${subjectSlug}/${chapterSlug}/${questionNumber}`);
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bookmarked Questions</h1>
        <p className="text-muted-foreground">
          View and manage your bookmarked questions from {dataSource === 'PYQ' ? 'Previous Year Questions' : 'Daily Practice Problems'}.
        </p>
      </div>
      
      <Card className="mb-6 p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <input 
              type="text" 
              value={searchQuery} 
              onChange={handleSearchChange}
              placeholder="Search bookmarked questions..."
              className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <select 
              value={sortOption} 
              onChange={handleSortChange}
              className="w-full p-2 rounded-md bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="moduleAZ">Subject (A-Z)</option>
              <option value="moduleZA">Subject (Z-A)</option>
            </select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {filteredBookmarks.length} {filteredBookmarks.length === 1 ? 'bookmark' : 'bookmarks'}
          </div>
        </div>
      </Card>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredBookmarks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <Card 
              key={bookmark.id} 
              className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary cursor-pointer"
              onClick={() => handleQuestionClick(bookmark)}
            >
              <div className="p-4 block h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="currentColor"
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-4 w-4 text-yellow-500 mr-2"
                    >
                      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                    <span className="text-sm text-muted-foreground">
                      Bookmarked on {formatDate(bookmark.timestamp)}
                    </span>
                  </div>
                  
                  <Badge variant="outline">
                    {bookmark.type === 'numerical' ? 'Numerical' : 
                     bookmark.type === 'multipleCorrect' ? 'Multiple Correct' : 
                     'Single Correct'}
                  </Badge>
                </div>
                
                <div className="mb-2 question-preview">
                  <MathContent content={bookmark.question_text || 'No question text available'} />
                  <div className="fade-overlay"></div>
                </div>
                
                <div className="mt-4 pt-2 border-t flex items-center justify-between">
                  <div>
                    <Badge variant="secondary" className="mr-2">
                      {bookmark.moduleName || 'Unknown Subject'}
                    </Badge>
                    <Badge variant="outline">
                      {bookmark.chapterName || 'Unknown Chapter'}
                    </Badge>
                  </div>
                  
                  <Button variant="ghost" size="sm" className="text-primary">
                    View Question
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="mb-4">
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
              className="h-12 w-12 mx-auto text-muted-foreground mb-4"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
            <h2 className="text-xl font-semibold mb-2">No bookmarks found</h2>
            <p className="text-muted-foreground mb-6">
              You haven't bookmarked any questions yet. Bookmark questions while solving them to find them here.
            </p>
          </div>
          
          <Button asChild>
            <Link to="/subjects">
              Browse Questions
            </Link>
          </Button>
        </Card>
      )}
    </Layout>
  );
};

export default BookmarksPage; 