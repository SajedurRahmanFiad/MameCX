// Safely make window.fetch writable and configurable to prevent sandbox/extension override crashes
try {
  const originalFetch = window.fetch;
  Object.defineProperty(window, 'fetch', {
    value: originalFetch,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn('Failed to configure fetch property as writable:', e);
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
