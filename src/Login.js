// src/Login.js
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
      <h2>Login to Continue</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}

export default Login;
