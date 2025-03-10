import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default Layout; 