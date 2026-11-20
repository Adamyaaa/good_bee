import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { installGlobalMockFetch } from './services/mockBackend';

// Migrate any legacy cached phone number or address in client browser localStorage
try {
  const raw = localStorage.getItem('goodbee_site_content');
  if (raw) {
    const sc = JSON.parse(raw);
    let updated = false;
    if (!sc.whatsappNumber || sc.whatsappNumber.includes('987654')) {
      sc.whatsappNumber = '+91-9963075000';
      updated = true;
    }
    if (sc.storeAddress && sc.storeAddress.includes('Western Ghats')) {
      sc.storeAddress = 'Good Bee Skincare Studio, Bengaluru, Karnataka, India';
      updated = true;
    }
    if (updated) {
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
