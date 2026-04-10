import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1a1f38',
          color: '#e0e9ff',
          border: '1px solid rgba(91,115,245,0.25)',
          borderRadius: '12px',
          fontFamily: 'Inter, sans-serif',
        },
        success: {
          iconTheme: { primary: '#5b73f5', secondary: '#1a1f38' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#1a1f38' },
        },
      }}
    />
  </StrictMode>,
);
