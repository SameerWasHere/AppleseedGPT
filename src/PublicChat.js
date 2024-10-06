// PublicChat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat.js';
import './PublicChat.css'; // Optional: add any specific styles for public chat

function PublicChat() {
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState(''); // State to store the header image URL
  const [link, setLink] = useState(''); // State to store the link
  const [loading, setLoading] = useState(true); // State to track if data is loading

  // Get the emailPrefix from the URL
  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length > 1) {
      setEmailPrefix(pathParts[1]); // Assuming the public link looks like "/username"
    }
  }, []);

  // Fetch the settings based on emailPrefix when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!emailPrefix) return;

        setLoading(true);

        const fetchSetting = async (key, setter) => {
          const response = await axios.get(`/api/settings?key=${key}&emailPrefix=${emailPrefix}`);
          if (response.data && response.data[key] !== undefined) {
            setter(response.data[key]);
          } else {
            console.error(`Failed to load ${key}`);
          }
        };

        await fetchSetting('title', setTitle);
        await fetchSetting('initial_message', setInitialMessage);
        await fetchSetting('headerImage', setHeaderImageUrl);
        await fetchSetting('link', setLink);
      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [emailPrefix]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="public-chat-container">
      {/* Header Area */}
      <div className="header-area">
        <a
          href={link || 'https://www.linkedin.com/in/johnny-appleseed-81a57b26a/'} // Use the fetched link or a fallback
          target="_blank"
          rel="noopener noreferrer"
          className="header-icon right-icon"
          aria-label="LinkedIn Profile"
        >
          <img src="/linkedin.png" alt="LinkedIn Icon" />
        </a>

        <div className="header-center">
          <img
            src={headerImageUrl || '/header.gif'} // Use the fetched header image URL or a fallback
            alt="Header GIF"
            className="header-gif"
          />
          <h1 className="title">{title || 'Loading...'}</h1> {/* Display fetched title */}
        </div>
      </div>

      {/* Chat Component */}
      <Chat title={title} initialMessage={initialMessage} />
    </div>
  );
}

export default PublicChat;
