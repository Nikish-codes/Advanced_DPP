import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchChapters } from '../store/moduleSlice';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const SubjectPage = () => {
  const { subjectName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { modules, chapters, dataSource } = useSelector((state) => state.modules);
  
  // Find module based on slug
  const currentModule = modules.find(module => 
    module.title.toLowerCase().replace(/\s+/g, '-') === subjectName
  );
  const currentChapters = chapters[currentModule?.id] || [];
  
  useEffect(() => {
    if (currentModule?.id) {
      dispatch(fetchChapters(currentModule.id));
    }
  }, [dispatch, currentModule?.id]);
  
  if (!currentModule) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Button asChild variant="outline">
            <Link to="/subjects">
              &larr; Back to Subjects
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            className="group mr-2"
            onClick={() => navigate('/subjects')}
          >
            <div className="flex items-center space-x-2">
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
              <span>Back to Subjects</span>
            </div>
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {dataSource === 'PYQ' ? 'Previous Year Questions' : 'Daily Practice Problems'}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{currentModule.title}</h1>
        <p className="text-muted-foreground">
          Select a chapter to start practicing questions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentChapters.map((chapter) => {
          const chapterSlug = chapter.title.toLowerCase().replace(/\s+/g, '-');
          return (
            <Link 
              key={chapter.id} 
              to={`/${subjectName}/${chapterSlug}`}
              className="block transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="border rounded-lg p-6 h-full hover:border-primary">
                <h2 className="text-xl font-semibold text-primary mb-2">{chapter.title}</h2>
                <p className="text-muted-foreground mb-4 flex-grow">
                  Practice questions from this chapter.
                </p>
                <div className="flex justify-end mt-auto pt-2">
                  <span className="text-primary flex items-center">
                    View Questions
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
                      className="h-4 w-4 ml-1"
                    >
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </Layout>
  );
};

export default SubjectPage; 