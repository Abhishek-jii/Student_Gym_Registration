import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './App.css'; // Optional: Add custom styling

ReactDOM.createRoot(document.getElementById('root')).render(
    
        <BrowserRouter>
            <App />
        </BrowserRouter>
);
