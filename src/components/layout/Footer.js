import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-accent font-bold text-xl">
              JEE Advanced
            </Link>
            <p className="text-text-secondary text-sm mt-1">
              Your preparation partner for JEE Advanced
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link to="/about" className="text-text-secondary hover:text-accent text-sm">
              About
            </Link>
            <Link to="/privacy" className="text-text-secondary hover:text-accent text-sm">
              Privacy Policy
            </Link>
            <Link to="/contact" className="text-text-secondary hover:text-accent text-sm">
              Contact
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-800">
          <p className="text-text-secondary text-sm text-center">
            &copy; {currentYear} JEE Advanced Preparation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 