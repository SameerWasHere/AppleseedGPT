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

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="app-container">
      <ContextEditor user={user} setUser={setUser} />
    </div>
  );
}

export default App;
