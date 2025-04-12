import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import LoadingScreen from './components/LoadingScreen';
import './index.css';

// Find the existing loading-root element
const loadingRoot = document.getElementById('loading-root');

// Render the loading screen into the existing loading-root element
const loadingRender = ReactDOM.createRoot(loadingRoot);
loadingRender.render(
  <ThemeProvider>
    <LoadingScreen 
      onLoadingComplete={() => {
        // When loading is complete, show the main app and remove loading class
        document.getElementById('root').style.opacity = '1';
        document.body.classList.remove('loading');
        
        setTimeout(() => {
          // Remove loading root after transition completes
          if (loadingRoot.parentNode) {
            loadingRoot.parentNode.removeChild(loadingRoot);
          }
        }, 1000);
      }} 
    />
  </ThemeProvider>
);

// Apply initial styles to prevent FOUC (Flash of Unstyled Content)
const initialStyles = document.createElement('style');
initialStyles.textContent = `
  #root { opacity: 0; transition: opacity 0.5s ease-in; }
`;
document.head.appendChild(initialStyles);

// Render the main application
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);