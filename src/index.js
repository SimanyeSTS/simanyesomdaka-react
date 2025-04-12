import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from "./context/modal-context";
import { ThemeProvider } from "./context/theme-context";
import './index.css';

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </ThemeProvider>
  </React.StrictMode>
);