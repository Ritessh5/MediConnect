// Entry point for rendering the React application to the DOM
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Get the root DOM element to render the app into
createRoot(document.getElementById('root')).render(
  // Use StrictMode to highlight potential problems in the app
  <StrictMode>
    <App />
  </StrictMode>,
)
