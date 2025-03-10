import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { setSidebarOpen } from '../../store/uiSlice';
import { getAttemptedQuestions } from '../../utils/localStorage';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { modules, currentModule, chapters, currentChapter } = useSelector((state) => state.modules);
  const { questions } = useSelector((state) => state.questions);
  
  const attemptedQuestions = getAttemptedQuestions();
  
  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      dispatch(setSidebarOpen(false));
    }
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out z-30 pt-16 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:static md:h-auto md:pt-0 md:z-0`}
      >
        <div className="p-4 h-full overflow-y-auto">
          <h2 className="text-lg font-semibold text-accent mb-4">Navigation</h2>
          
          {/* Modules */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Subjects</h3>
            <ul className="space-y-1">
              {modules.map((module) => (
                <li key={module.id}>
                  <Link
                    to={`/module/${module.id}`}
                    className={`block px-2 py-1 rounded ${
                      currentModule?.id === module.id
                        ? 'bg-accent bg-opacity-20 text-accent'
                        : 'text-text hover:bg-primary'
                    }`}
                    onClick={handleLinkClick}
                  >
                    {module.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Chapters (if a module is selected) */}
          {currentModule && chapters[currentModule.id] && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Chapters</h3>
              <ul className="space-y-1">
                {chapters[currentModule.id].map((chapter) => (
                  <li key={chapter.id}>
                    <Link
                      to={`/module/${currentModule.id}/chapter/${chapter.id}`}
                      className={`block px-2 py-1 rounded ${
                        currentChapter?.id === chapter.id
                          ? 'bg-accent bg-opacity-20 text-accent'
                          : 'text-text hover:bg-primary'
                      }`}
                      onClick={handleLinkClick}
                    >
                      {chapter.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Questions (if a chapter is selected) */}
          {currentChapter && questions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-2">Questions</h3>
              <ul className="space-y-1">
                {questions.map((question, index) => {
                  const isAttempted = attemptedQuestions[question.question_id];
                  const isCorrect = isAttempted?.isCorrect;
                  
                  return (
                    <li key={question.question_id}>
                      <Link
                        to={`/module/${currentModule.id}/chapter/${currentChapter.id}/question/${question.question_id}`}
                        className={`flex items-center px-2 py-1 rounded ${
                          location.pathname.includes(question.question_id)
                            ? 'bg-accent bg-opacity-20 text-accent'
                            : 'text-text hover:bg-primary'
                        }`}
                        onClick={handleLinkClick}
                      >
                        <span className="mr-2">Q{index + 1}.</span>
                        {isAttempted && (
                          <span className={`w-2 h-2 rounded-full mr-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`} />
                        )}
                        <span className="truncate">
                          {question.question.text.replace(/<[^>]*>/g, '').substring(0, 20)}...
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar; 