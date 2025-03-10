import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchChapters } from '../store/moduleSlice';
import Layout from '../components/Layout';

const SubjectPage = () => {
  const { subjectId } = useParams();
  const dispatch = useDispatch();
  const { modules, chapters } = useSelector((state) => state.modules);
  
  const currentModule = modules.find(module => module.id === subjectId);
  const currentChapters = chapters[subjectId] || [];
  
  useEffect(() => {
    if (subjectId) {
      dispatch(fetchChapters(subjectId));
    }
  }, [dispatch, subjectId]);
  
  if (!currentModule) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Subject not found</h1>
          <Link to="/" className="text-accent">
            &larr; Back to Home
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="mb-8">
        <Link to="/" className="text-accent mb-4 inline-block">
          &larr; Back to Subjects
        </Link>
        <h1 className="text-3xl font-bold mb-2">{currentModule.title}</h1>
        <p className="text-text-secondary">
          Select a chapter to start practicing questions.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentChapters.map((chapter) => (
          <Link 
            key={chapter.id} 
            to={`/subjects/${subjectId}/chapters/${chapter.id}`}
            className="card chapter-card hover:border-accent"
          >
            <h2 className="text-xl font-semibold text-accent mb-2">{chapter.title}</h2>
            <p className="text-text-secondary mb-4 flex-grow">
              Practice questions from this chapter.
            </p>
            <div className="flex justify-end mt-auto pt-2">
              <span className="text-accent">
                View Questions &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default SubjectPage; 