// Login.js (Updated for sales-oriented page with top panel)
import React from 'react';
import { signInWithGoogle } from './firebase.js';
import './Login.css';

function Login({ setUser }) {
  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      setUser(result.user);
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      alert('Failed to sign in with Google.');
    }
  };

  return (
    <div className="login-container">
      {/* Top Panel Section */}
      <div className="top-panel">
        <div className="brand-logo">PersonalGPT</div>
        <h1>Create Your Own Personal Chatbot</h1>
        <div className="scroll-down">scroll down</div>
      </div>

      {/* Header Section */}
      <header className="header-section">
        <h1>Create Your Own Personal Chatbot</h1>
        <p></p>
        <button onClick={handleLogin} className="signin-button">Sign in with Google to Get Started</button>
      </header>

      {/* Step-by-Step Explanation Section */}
      <section className="steps-section">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <h3>1. Log In</h3>
            <p>Use your Google account to sign in securely and get started instantly.</p>
          </div>
          <div className="step">
            <h3>2. Customize Your Chatbot</h3>
            <p>Give your chatbot a unique personality by adding context, setting an initial message, and much more.</p>
          </div>
          <div className="step">
            <h3>3. Share Your Chatbot</h3>
            <p>Generate a link and share your personalized chatbot with friends, family, or your audience.</p>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section className="cta-section">
        <button onClick={handleLogin} className="signin-button">Sign in with Google to Get Started</button>
      </section>
    </div>
  );
}

export default Login;