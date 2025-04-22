import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import './index.css';
import LoadingScreen from './components/LoadingScreen';

document.documentElement.style.overflow = 'hidden';
document.documentElement.style.height = '100%';
document.body.style.overflow = 'hidden';
document.body.style.height = '100%';

const loadingRoot = document.createElement('div');
loadingRoot.id = 'loading-root';
loadingRoot.style.position = 'fixed';
loadingRoot.style.top = '0';
loadingRoot.style.left = '0';
loadingRoot.style.width = '100%';
loadingRoot.style.height = '100%';
loadingRoot.style.zIndex = '9999';

loadingRoot.style.transform = 'translateZ(0)';
loadingRoot.style.backfaceVisibility = 'hidden';
loadingRoot.style.perspective = '1000px';

document.body.prepend(loadingRoot);

const appRoot = ReactDOM.createRoot(document.getElementById('root'));
const loadingRender = ReactDOM.createRoot(loadingRoot);

const hiddenAppContainer = document.createElement('div');
hiddenAppContainer.id = 'hidden-app-container';
hiddenAppContainer.style.position = 'fixed'; 
hiddenAppContainer.style.top = '0';
hiddenAppContainer.style.left = '0';
hiddenAppContainer.style.width = '100%';
hiddenAppContainer.style.height = '100%';
hiddenAppContainer.style.zIndex = '-1';
hiddenAppContainer.style.opacity = '0';
hiddenAppContainer.style.pointerEvents = 'none';
document.body.appendChild(hiddenAppContainer);

const hiddenAppRoot = ReactDOM.createRoot(hiddenAppContainer);

hiddenAppRoot.render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);

loadingRender.render(
  <ThemeProvider>
    <LoadingScreen 
      onLoadingComplete={(shouldRemove) => {
        if (!shouldRemove) {
          appRoot.render(
            <ThemeProvider>
              <ModalProvider>
                <App onLoaded={() => {
                }} />
              </ModalProvider>
            </ThemeProvider>
          );
          return;
        }
        
        document.documentElement.style.overflow = '';
        document.documentElement.style.height = '';
        document.body.style.overflow = '';
        document.body.style.height = '';
        
        if (document.body.contains(hiddenAppContainer)) {
          hiddenAppContainer.remove();
        }
        
        setTimeout(() => {
          if (document.body.contains(loadingRoot)) {
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