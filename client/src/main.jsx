import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { installGlobalMockFetch } from './services/mockBackend';

// Migrate any legacy cached phone number in client browser localStorage
try {
  const raw = localStorage.getItem('goodbee_site_content');
  if (raw) {
    const sc = JSON.parse(raw);
    if (!sc.whatsappNumber || sc.whatsappNumber.includes('99630')) {
      sc.whatsappNumber = '987654321';
      localStorage.setItem('goodbee_site_content', JSON.stringify(sc));
    }
  }
} catch (e) {}

// Install resilient in-browser mock router for zero-error Netlify / Vercel SPA execution
installGlobalMockFetch();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
