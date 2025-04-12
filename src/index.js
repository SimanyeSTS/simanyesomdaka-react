import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import './index.css';
import LoadingScreen from './components/LoadingScreen';

// Aggressive approach to prevent white flash and ensure progress bar visibility

// Block page interactions during initial load
document.documentElement.style.overflow = 'hidden';
document.documentElement.style.height = '100%';
document.body.style.overflow = 'hidden';
document.body.style.height = '100%';

// Create a separate root for loading screen
const loadingRoot = document.createElement('div');
loadingRoot.id = 'loading-root';
loadingRoot.style.position = 'fixed';
loadingRoot.style.top = '0';
loadingRoot.style.left = '0';
loadingRoot.style.width = '100%';
loadingRoot.style.height = '100%';
loadingRoot.style.zIndex = '9999';

// Force hardware acceleration on loading root
loadingRoot.style.transform = 'translateZ(0)';
loadingRoot.style.backfaceVisibility = 'hidden';
loadingRoot.style.perspective = '1000px';

// Add it to the body immediately, before anything else
document.body.prepend(loadingRoot);

// Create a root for the app but don't render yet
const appRoot = ReactDOM.createRoot(document.getElementById('root'));
const loadingRender = ReactDOM.createRoot(loadingRoot);

// Create a placeholder div that will ensure app content is loaded but hidden
const hiddenAppContainer = document.createElement('div');
hiddenAppContainer.id = 'hidden-app-container';
hiddenAppContainer.style.position = 'fixed'; 
hiddenAppContainer.style.top = '0';
hiddenAppContainer.style.left = '0';
hiddenAppContainer.style.width = '100%';
hiddenAppContainer.style.height = '100%';
hiddenAppContainer.style.zIndex = '-1'; // Behind everything
hiddenAppContainer.style.opacity = '0';
hiddenAppContainer.style.pointerEvents = 'none';
document.body.appendChild(hiddenAppContainer);

const hiddenAppRoot = ReactDOM.createRoot(hiddenAppContainer);

// Pre-render the app in hidden container to start loading all resources
hiddenAppRoot.render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);

// Render the loading screen
loadingRender.render(
  <ThemeProvider>
    <LoadingScreen 
      onLoadingComplete={(shouldRemove) => {
        // If shouldRemove is false, we're just preparing the app but not removing the loading screen yet
        if (!shouldRemove) {
          // Render the actual app now but keep loading screen visible
          appRoot.render(
            <ThemeProvider>
              <ModalProvider>
                <App onLoaded={() => {
                  console.log("App fully loaded in main container");
                }} />
              </ModalProvider>
            </ThemeProvider>
          );
          return;
        }
        
        // If shouldRemove is true, we can now remove the loading screen
        // The app is already rendered and ready behind it
        
        // Restore scrolling
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        // Remove the hidden container
        if (document.body.contains(hiddenAppContainer)) {
          hiddenAppContainer.remove();
        }
        
        // Remove the loading screen with a slight delay to ensure smooth transition
        setTimeout(() => {
          if (document.body.contains(loadingRoot)) {
            // Use a clean fade out to prevent any flickering
            loadingRoot.style.transition = 'opacity 0.15s ease';
            loadingRoot.style.opacity = '0';
            
            setTimeout(() => {
              loadingRoot.remove();
            }, 150);
          }
        }, 100);
      }} 
    />
  </ThemeProvider>
);