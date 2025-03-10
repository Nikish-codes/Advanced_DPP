import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { toggleSidebar } from '../../store/uiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { currentModule, currentChapter } = useSelector((state) => state.modules);
  
  // Generate breadcrumb items based on current location
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Home', path: '/' }
    ];
    
    if (currentModule) {
      breadcrumbs.push({
        label: currentModule.title,
        path: `/module/${currentModule.id}`
      });
    }
    
    if (currentChapter) {
      breadcrumbs.push({
        label: currentChapter.title,
        path: `/module/${currentModule.id}/chapter/${currentChapter.id}`
      });
    }
    
    // Check if we're on a question page
    if (location.pathname.includes('/question/')) {
      const questionId = location.pathname.split('/').pop();
      breadcrumbs.push({
        label: `Question ${questionId}`,
        path: location.pathname
      });
    }
    
    return breadcrumbs;
  };
  
  const breadcrumbs = getBreadcrumbs();
  
  return (
    <header className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            className="mr-4 text-text hover:text-accent focus:outline-none"
            onClick={() => dispatch(toggleSidebar())}
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <Link to="/" className="text-2xl font-bold text-accent">
            JEE Advanced
          </Link>
        </div>
        
        {/* Breadcrumbs */}
        <nav className="hidden md:flex">
          <ol className="flex items-center space-x-2">
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && (
                  <li className="text-text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                )}
                <li>
                  <Link 
                    to={item.path} 
                    className={`text-sm ${index === breadcrumbs.length - 1 ? 'text-accent font-medium' : 'text-text-secondary hover:text-text'}`}
                  >
                    {item.label}
                  </Link>
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>
    </header>
  );
};

export default Header; 