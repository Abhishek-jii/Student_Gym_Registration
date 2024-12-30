import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import './App.css'; // Optional: Add custom styling
import { MyContextProvider } from './components/context.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
    <MyContextProvider>
        <BrowserRouter>
        
            <App />
            
        </BrowserRouter></MyContextProvider>
);
