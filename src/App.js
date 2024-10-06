// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextEditor from './ContextEditor.js'; // Ensure the path is correct
import './App.css';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login.js';

function App() {
  const [user, setUser] = useState(null); // State to store logged-in user

  // Listen for user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="app-container">
      {/* Remove redundant sign-out button and public link from here */}
      <ContextEditor user={user} handleSignOut={handleSignOut} />
    </div>
  );
}

export default App;


