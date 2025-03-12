import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { fetchModules } from '../store/moduleSlice';

const SubjectsPage = () => {
  const { modules, dataSource, loading } = useSelector((state) => state.modules);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Determine title based on data source
  const pageTitle = dataSource === 'PYQ' 
    ? 'JEE Advanced Previous Year Questions' 
    : 'JEE Advanced Daily Practice Problems';
  
  // Fetch modules if they're not loaded
  useEffect(() => {
    if (modules.length === 0) {
      dispatch(fetchModules());
    }
  }, [dispatch, modules.length]);
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="flex items-center mb-2">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => navigate('/')}
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
              className="h-4 w-4 mr-2"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back to Selection
          </Button>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {dataSource === 'PYQ' ? 'Previous Year Questions' : 'Daily Practice Problems'}
          </Badge>
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">{pageTitle}</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : modules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const subjectSlug = module.title.toLowerCase().replace(/\s+/g, '-');
            return (
              <Link 
                key={module.id} 
                to={`/${subjectSlug}`}
                className="block transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Card className="h-full border hover:border-primary">
                  <div className="p-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-primary">{module.title}</h3>
                    <div className="flex items-center space-x-2 text-primary">
                      <span className="text-sm">Start</span>
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
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">No subjects found. Please try again or select a different option.</p>
          <Button onClick={() => navigate('/')}>
            Return to Selection
          </Button>
        </div>
      )}
    </Layout>
  );
};

export default SubjectsPage; 