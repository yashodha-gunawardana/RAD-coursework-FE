import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx'


// The '!' tells TypeScript that this element exists and is not null
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />  
  </StrictMode>,
)
