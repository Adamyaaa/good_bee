import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { installGlobalMockFetch } from './services/mockBackend';

// Install resilient in-browser mock router for zero-error Netlify SPA execution
installGlobalMockFetch();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
