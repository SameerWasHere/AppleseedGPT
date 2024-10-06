// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextEditor from './ContextEditor.js'; // Ensure the path is correct
import './App.css';
import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login.js';

function App() {
  const [title, setTitle] = useState(''); // State to store the title
  const [email, setEmail] = useState(''); // State to store the email
  const [link, setLink] = useState(''); // State to store the link
  const [headerImageUrl, setHeaderImageUrl] = useState(''); // State to store the header image URL
  const [initialMessage, setInitialMessage] = useState(''); // State to store the initial message
  const [user, setUser] = useState(null); // State to store logged-in user
  const [publicLink, setPublicLink] = useState(''); // State to store the public link

  // Listen for user state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch the title, email, link, header image URL, initial message, and generate public link when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!auth.currentUser) return;
        const emailPrefix = auth.currentUser.email.split('@')[0];

        // Use consolidated settings API to get each value
        const fetchSetting = async (key, setter) => {
          const response = await axios.get(`/api/settings?key=${key}&emailPrefix=${emailPrefix}`);
          if (response.data && response.data[key] !== undefined) {
            setter(response.data[key]);
          } else {
            console.error(`Failed to load ${key}`);
          }
        };

        await fetchSetting('title', setTitle);
        await fetchSetting('email', setEmail);
        await fetchSetting('link', setLink);
        await fetchSetting('headerImage', setHeaderImageUrl);
        await fetchSetting('initial_message', setInitialMessage);

        // Generate public link automatically
        const publicLinkResponse = await axios.put('/api/settings', { emailPrefix });
        setPublicLink(`${window.location.origin}/${publicLinkResponse.data.publicLink}`);
      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      signOut(auth)
        .then(() => {
          setUser(null);
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicLink).then(() => {
      alert('Public link copied to clipboard!');
    }).catch((error) => {
      console.error('Failed to copy the link:', error);
    });
  };

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className="app-container">
      <header className="header-area">
        <div className="header-top">
          <h2 className="welcome-text">Welcome, {user.displayName}</h2>
          <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
        </div>
        {publicLink && (
          <div className="public-link-container">
            <div className="public-link">
              <p>Your Public Chatbot Link:</p>
              <a href={publicLink} target="_blank" rel="noopener noreferrer">
                {publicLink}
              </a>
              <button className="copy-button" onClick={copyToClipboard}>Copy Link</button>
            </div>
          </div>
        )}
      </header>
      <ContextEditor />
    </div>
  );
}

export default App;