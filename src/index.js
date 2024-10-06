// index.js (Updated to include routing for PublicChat and App)
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './App.js';  // Added the .js extension to correctly reference the file
import PublicChat from './PublicChat.js'; // Added the .js extension to correctly reference the file
import './index.css';

function MainRouter() {
  return (
    <Router>
      <Switch>
        {/* Route for the main application that includes the ContextEditor and authenticated user experience */}
        <Route exact path="/" component={App} />
        
        {/* Route for public links that users can access without authentication */}
        <Route path="/:username" component={PublicChat} />
      </Switch>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>,
  document.getElementById('root')
);
