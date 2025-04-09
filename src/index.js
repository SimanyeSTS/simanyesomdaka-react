import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import './index.css';

const loadingRoot = document.createElement('div');
loadingRoot.id = 'loading-root';
loadingRoot.style.position = 'fixed';
loadingRoot.style.top = '0';
loadingRoot.style.left = '0';
loadingRoot.style.width = '100%';
loadingRoot.style.height = '100%';
loadingRoot.style.zIndex = '9999';
document.body.prepend(loadingRoot);

const loadingRender = ReactDOM.createRoot(loadingRoot);
loadingRender.render(
  <ThemeProvider>
    <ModalProvider>
      <App />
    </ModalProvider>
  </ThemeProvider>
);

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(
  <ThemeProvider>
    <ModalProvider>
      <App onLoaded={() => {
        setTimeout(() => {
          loadingRoot.remove();
        }, 1000);
      }} />
    </ModalProvider>
  </ThemeProvider>
);