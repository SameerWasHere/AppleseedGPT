// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat.js';
import './App.css';
import ContextEditor from './ContextEditor.js'; // Ensure the path is correct

function App() {
  const [clickCount, setClickCount] = useState(0);
  const [showPasswordPanel, setShowPasswordPanel] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState(''); // State to store the title
  const [email, setEmail] = useState(''); // State to store the email
  const [link, setLink] = useState(''); // State to store the link
  const [headerImageUrl, setHeaderImageUrl] = useState(''); // State to store the header image URL
  const [initialMessage, setInitialMessage] = useState(''); // State to store the initial message

  // Fetch the title, email, link, header image URL, and initial message from the database when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use consolidated settings API to get each value
        const fetchSetting = async (key, setter) => {
          const response = await axios.get(`/api/settings?key=${key}`);
          if (response.data && response.data[key] !== undefined) {
            setter(response.data[key]);
          } else {
            console.error(`Failed to load ${key}`);
          }
        };

        await fetchSetting('appleseed_title', setTitle);
        await fetchSetting('appleseed_email', setEmail);
        await fetchSetting('appleseed_link', setLink);
        await fetchSetting('appleseed_headerImage', setHeaderImageUrl);
        await fetchSetting('appleseed_initial_message', setInitialMessage);
      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
      }
    };

    fetchData();
  }, []);

  // Handler for GIF click
  const handleGifClick = () => {
    setClickCount((prevCount) => prevCount + 1);
    if (clickCount + 1 === 5) {
      setShowPasswordPanel(true);
      setClickCount(0); // Reset the click count
    }
  };

  // Handler for password submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const storedPassword = process.env.REACT_APP_PASSWORD; // Ensure the environment variable is set correctly
    if (password === storedPassword) {
      setIsAuthenticated(true);
      setShowPasswordPanel(false);
    } else {
      alert('Incorrect password, try again.');
    }
  };

  return (
    <div className="app-container">
      {/* Header Area */}
      <div className="header-area">
        <a
          href={`mailto:${email || 'loading@example.com'}`} // Use the fetched email or a fallback
          className="header-icon left-icon"
          aria-label="Send Email"
        >
          <img src="/mail.png" alt="Mail Icon" />
        </a>

        <div className="header-center">
          <img
            src={headerImageUrl || '/header.gif'} // Use the fetched header image URL or a fallback
            alt="Header GIF"
            className="header-gif"
            onClick={handleGifClick}
          />
          <h1 className="title">{title || 'Loading...'}</h1> {/* Display fetched title */}
        </div>

        <a
          href={link || 'https://www.linkedin.com/in/johnny-appleseed-81a57b26a/'} // Use the fetched link or a fallback
          target="_blank"
          rel="noopener noreferrer"
          className="header-icon right-icon"
          aria-label="LinkedIn Profile"
        >
          <img src="/linkedin.png" alt="LinkedIn Icon" />
        </a>
      </div>

      {showPasswordPanel && (
        <div className="password-panel">
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isAuthenticated ? (
        <ContextEditor />
      ) : (
        <Chat title={title} initialMessage={initialMessage} />
      )}
    </div>
  );
}

export default App;
