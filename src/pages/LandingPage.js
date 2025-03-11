import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { setDataSource, fetchModules } from '../store/moduleSlice';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleSelectDataSource = (source) => {
    dispatch(setDataSource(source));
    dispatch(fetchModules());
    navigate('/subjects');
  };
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-6">JEE Advanced Practice</h1>
        <p className="text-lg text-muted-foreground mb-8">Choose what you want to practice</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card 
          className="border-2 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => handleSelectDataSource('DPP')}
        >
          <div className="p-8 flex flex-col items-center text-center h-full">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
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
                className="h-10 w-10 text-primary"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Daily Practice Problems</h2>
            <p className="text-muted-foreground mb-6">
              Curated daily practice problems to strengthen your concepts and improve problem-solving skills.
            </p>
            <Button 
              className="mt-auto w-full"
              onClick={() => handleSelectDataSource('DPP')}
            >
              Start DPP Practice
            </Button>
          </div>
        </Card>
        
        <Card 
          className="border-2 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => handleSelectDataSource('PYQ')}
        >
          <div className="p-8 flex flex-col items-center text-center h-full">
            <div className="mb-4 bg-primary/10 p-4 rounded-full">
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
                className="h-10 w-10 text-primary"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                <line x1="16" x2="16" y1="2" y2="6"/>
                <line x1="8" x2="8" y1="2" y2="6"/>
                <line x1="3" x2="21" y1="10" y2="10"/>
                <path d="m9 16 2 2 4-4"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Previous Year Questions</h2>
            <p className="text-muted-foreground mb-6">
              Practice with actual JEE Advanced previous year questions to get familiar with the exam pattern.
            </p>
            <Button 
              className="mt-auto w-full"
              onClick={() => handleSelectDataSource('PYQ')}
            >
              Start PYQ Practice
            </Button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default LandingPage; 