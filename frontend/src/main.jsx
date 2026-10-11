import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css'; // Optional styling if present; remove if you don't have this file

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);