import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './AuthContext';
import './highContrast.css';
import './keyboardAccessibility.css';
import { initClickToSpeak } from './utils/speech';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Enable click-to-speak for marked regions
initClickToSpeak();

root.render(
    <AuthProvider>
        <App />
    </AuthProvider>
);
