import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import LoadingScreen from './components/LoadingScreen';
import './index.css';

// Create loading container that will be rendered first
const loadingRoot = document.createElement('div');
loadingRoot.id = 'loading-root';
loadingRoot.style.position = 'fixed';
loadingRoot.style.top = '0';
loadingRoot.style.left = '0';
loadingRoot.style.width = '100%';
loadingRoot.style.height = '100%';
loadingRoot.style.zIndex = '9999';
document.body.prepend(loadingRoot);

// Apply initial styles to prevent FOUC (Flash of Unstyled Content)
const initialStyles = document.createElement('style');
initialStyles.textContent = `
  body { overflow: hidden; margin: 0; padding: 0; }
  #root { opacity: 0; transition: opacity 0.5s ease-in; }
`;
document.head.appendChild(initialStyles);

// Render the loading screen first, before any other content
const loadingRender = ReactDOM.createRoot(loadingRoot);
loadingRender.render(
  <ThemeProvider>
    <LoadingScreen 
      onLoadingComplete={() => {
        // When loading is complete, show the main app and remove loading screen
        document.getElementById('root').style.opacity = '1';
        setTimeout(() => {
          // Remove loading root after transition completes
          loadingRoot.remove();
          initialStyles.remove();
        }, 1000);
      }} 
    />
  </ThemeProvider>
);

// Render the main application
const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);