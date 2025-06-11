
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App.tsx'
import './index.css'

// Function to initialize the app with error handling
const initializeApp = () => {
  try {
    const rootElement = document.getElementById('root');
    
    if (!rootElement) {
      console.error('Fatal: Root element not found in the DOM');
      return;
    }
    
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    
  } catch (error) {
    console.error('Fatal error during application initialization:', error);
  }
};

// Start the application
initializeApp();
