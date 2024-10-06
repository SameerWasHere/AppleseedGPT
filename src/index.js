// index.js (Updated to include routing for PublicChat and App)
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App.js';
import PublicChat from './PublicChat.js';
import './index.css';

function MainRouter() {
  return (
    <Router>
      <Routes>
        {/* Route for the main application that includes the ContextEditor and authenticated user experience */}
        <Route path="/" element={<App />} />

        {/* Route for public links that users can access without authentication */}
        <Route path="/chat/:username" element={<PublicChat />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>,
  document.getElementById('root')
);
