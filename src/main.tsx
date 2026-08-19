import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {initAnalytics} from './analytics';
import App from './App.tsx';
import './index.css';

// Defensive patch for environments/extensions attempting to redefine window.fetch
if (typeof window !== 'undefined') {
  try {
    let currentFetch = window.fetch;
    const descriptor = Object.getOwnPropertyDescriptor(window, 'fetch') || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'fetch');
    if (descriptor && (!descriptor.writable || !descriptor.set)) {
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(v) {
          currentFetch = v;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignore if non-configurable
  }
}

initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
