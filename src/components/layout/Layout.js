import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useSelector } from 'react-redux';

const Layout = ({ children }) => {
  const { loading } = useSelector((state) => state.ui);
  
  return (
    <div className="flex flex-col min-h-screen bg-primary text-text">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6">
          {/* Loading overlay */}
          {loading && (
            <div className="fixed inset-0 bg-primary bg-opacity-80 flex items-center justify-center z-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          )}
          
          {children}
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout; 