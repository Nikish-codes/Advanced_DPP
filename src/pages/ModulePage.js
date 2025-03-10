import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchModules, fetchChapters, setCurrentModule, clearCurrentChapter } from '../store/moduleSlice';
import { Card } from '../components/ui/card';

const ModulePage = () => {
  const { moduleId } = useParams();
  const dispatch = useDispatch();
  
  const { modules, chapters, currentModule, loading, error } = useSelector((state) => state.modules);
  
  useEffect(() => {
    // If modules are not loaded yet, fetch them
    if (modules.length === 0) {
      dispatch(fetchModules());
    }
    
    // Find the current module
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      dispatch(setCurrentModule(module));
    }
    
    // Clear current chapter
    dispatch(clearCurrentChapter());
    
    // Fetch chapters for this module
    dispatch(fetchChapters(moduleId));
  }, [dispatch, moduleId, modules]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-20 text-red-500 p-4 rounded-md">
        Error loading module data: {error}
      </div>
    );
  }
  
  if (!currentModule) {
    return (
      <div className="bg-yellow-500 bg-opacity-20 text-yellow-500 p-4 rounded-md">
        Module not found. Please select a valid module.
      </div>
    );
  }
  
  const moduleChapters = chapters[moduleId] || [];
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">{currentModule.title}</h1>
        <p className="text-text-secondary">
          {getModuleDescription(currentModule.id)}
        </p>
      </div>
      
      {moduleChapters.length === 0 ? (
        <div className="bg-secondary p-6 rounded-lg shadow-md">
          <p className="text-text-secondary">No chapters found for this module.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {moduleChapters.map((chapter) => (
            <Link 
              key={chapter.id} 
              to={`/module/${moduleId}/chapter/${chapter.id}`}
            >
              <Card className="h-full hover:border-accent hover:border transition-colors cursor-pointer">
                <h2 className="text-xl font-semibold text-accent mb-2">{chapter.title}</h2>
                <p className="text-text-secondary mb-4">
                  {getChapterDescription(chapter)}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800">
                  <span className="text-sm text-text-secondary">
                    {getQuestionCount(chapter)} Questions
                  </span>
                  <span className="inline-flex items-center text-accent">
                    Explore
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get module description
const getModuleDescription = (moduleId) => {
  switch (moduleId) {
    case 'physics':
      return 'Physics forms the foundation of engineering and technology. Master these chapters to excel in JEE Advanced.';
    case 'chemistry':
      return 'Chemistry connects the microscopic structure of matter to its macroscopic properties. These chapters cover essential concepts for JEE Advanced.';
    case 'mathematics':
      return 'Mathematics is the language of science and engineering. These chapters will help you develop problem-solving skills for JEE Advanced.';
    default:
      return 'Explore the chapters in this module to strengthen your understanding of key concepts.';
  }
};

// Helper function to get a brief description for a chapter
const getChapterDescription = (chapter) => {
  // If we had actual descriptions in the data, we would use those
  // For now, we'll generate a generic description
  return `Comprehensive coverage of ${chapter.title} concepts with practice questions of varying difficulty levels.`;
};

// Helper function to count questions in a chapter
const getQuestionCount = (chapter) => {
  let count = 0;
  
  if (chapter.sections && Array.isArray(chapter.sections)) {
    chapter.sections.forEach(section => {
      if (section.questions && Array.isArray(section.questions)) {
        count += section.questions.length;
      }
    });
  }
  
  return count;
};

export default ModulePage; 