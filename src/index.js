import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Global MathJax configuration
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
  },
  startup: {
    pageReady: () => {
      console.log('MathJax is ready globally');
    }
  },
  svg: {
    fontCache: 'global'
  },
  renderActions: {
    addMenu: [], // Disable the context menu
    checkLoading: []  // Disable the loading message
  }
};

// Load MathJax script
const loadMathJax = () => {
  // Check if MathJax is already loaded
  if (document.getElementById('mathjax-script')) {
    return;
  }
  
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'; // Using SVG output for better stability
  script.async = true;
  script.id = 'mathjax-script';
  document.head.appendChild(script);
};

// Load MathJax once the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadMathJax);
} else {
  loadMathJax();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
