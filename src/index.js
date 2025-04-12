import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";

// 1. Render loading screen IMMEDIATELY
const loadingRoot = ReactDOM.createRoot(document.getElementById('loading-root'));
loadingRoot.render(
  <ThemeProvider>
    <ModalProvider>
      <App loadingMode />
    </ModalProvider>
  </ThemeProvider>
);

// 2. Render main app (will hydrate behind loading screen)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider>
    <ModalProvider>
      <App onLoaded={() => {
        // Remove loading screen when EVERYTHING is ready
        setTimeout(() => {
          document.body.classList.remove('loading');
          document.getElementById('loading-root').remove();
        }, 300);
      }} />
    </ModalProvider>
  </ThemeProvider>
);