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

  // Fetch the title, email, link, and header image URL from the database when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleResponse = await axios.get('/api/getTitle'); // API endpoint to fetch the title
        if (titleResponse.data && titleResponse.data.title) {
          setTitle(titleResponse.data.title);
        } else {
          alert('Failed to load the title.');
        }

        const emailResponse = await axios.get('/api/getEmail'); // API endpoint to fetch the email
        if (emailResponse.data && emailResponse.data.email) {
          setEmail(emailResponse.data.email);
        } else {
          alert('Failed to load the email.');
        }

        const linkResponse = await axios.get('/api/getLink'); // API endpoint to fetch the link
        if (linkResponse.data && linkResponse.data.link) {
          setLink(linkResponse.data.link);
        } else {
          alert('Failed to load the link.');
        }

        // Fetch header image URL from the database
        const headerImageResponse = await axios.get('/api/getHeaderImage'); // Update the endpoint as needed
        if (headerImageResponse.data && headerImageResponse.data.appleseed_headerImage) {
          setHeaderImageUrl(headerImageResponse.data.appleseed_headerImage);
        } else {
          alert('Failed to load the header image.');
        }
      } catch (error) {
        alert('An error occurred while fetching the data.');
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
        <Chat title={title} />
      )}
    </div>
  );
}

export default App;
