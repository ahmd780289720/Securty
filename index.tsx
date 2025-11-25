import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// CLEAN START: No Service Workers, No Caching logic.
// This ensures the app runs directly from the memory blob without looking for missing files.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);