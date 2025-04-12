import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import './index.css';
import LoadingScreen from './components/LoadingScreen';

// Create a separate root for loading screen
const loadingRoot = document.createElement('div');
loadingRoot.id = 'loading-root';
loadingRoot.style.position = 'fixed';
loadingRoot.style.top = '0';
loadingRoot.style.left = '0';
loadingRoot.style.width = '100%';
loadingRoot.style.height = '100%';
loadingRoot.style.zIndex = '9999';

// Add it to the body immediately, before anything else
document.body.prepend(loadingRoot);

// Ensure the loading screen is the first thing that renders
const loadingRender = ReactDOM.createRoot(loadingRoot);

// First render only the ThemeProvider and LoadingScreen
loadingRender.render(
  <React.StrictMode>
    <ThemeProvider>
      <LoadingScreen 
        onLoadingComplete={() => {
          // When loading is complete, render the main app
          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(
            <React.StrictMode>
              <ThemeProvider>
                <ModalProvider>
                  <App onLoaded={() => {
                    // Remove the loading screen after main app is loaded
                    setTimeout(() => {
                      if (document.body.contains(loadingRoot)) {
                        loadingRoot.remove();
                      }
                    }, 1000);
                  }} />
                </ModalProvider>
              </ThemeProvider>
            </React.StrictMode>
          );
        }} 
      />
    </ThemeProvider>
  </React.StrictMode>
);