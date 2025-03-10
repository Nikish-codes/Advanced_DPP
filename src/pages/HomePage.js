import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const HomePage = () => {
  const { modules } = useSelector((state) => state.modules);
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Practice Jee Advanced Questions</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card 
            key={module.id} 
            className="transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary"
          >
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-primary">{module.title}</h3>
              <Button asChild variant="ghost" size="sm" className="group">
                <Link to={`/subjects/${module.id}`} className="flex items-center space-x-2">
                  <span>Start</span>
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
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

export default HomePage; 