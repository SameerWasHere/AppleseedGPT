// PublicChat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat';
import './PublicChat.css';

function PublicChat() {
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [emailPrefix, setEmailPrefix] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(true); // New state for loading indication

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
        if (!emailPrefix) {
          console.error('Email prefix is missing.');
          return;
        }

        console.log(`Fetching data for emailPrefix: ${emailPrefix}`);
        
        const fetchSetting = async (key, setter) => {
          const response = await axios.get(`/api/settings?key=${key}&emailPrefix=${emailPrefix}`);
          if (response.data && response.data[key] !== undefined) {
            setter(response.data[key]);
          } else {
            console.error(`Failed to load ${key}.`);
          }
        };

        await Promise.all([
          fetchSetting('title', setTitle),
          fetchSetting('initial_message', setInitialMessage),
          fetchSetting('headerImage', setHeaderImageUrl),
          fetchSetting('link', setLink)
        ]);

        setLoading(false); // Set loading to false once data is fetched

      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [emailPrefix]);

  if (loading) {
    return <div className="public-chat-container"><p>Loading...</p></div>;
  }

  return (
    <div className="public-chat-container">
      {/* Header Area */}
      <div className="header-area">
        <a
          href={link || 'https://www.linkedin.com/in/johnny-appleseed-81a57b26a/'}
          target="_blank"
          rel="noopener noreferrer"
          className="header-icon right-icon"
          aria-label="LinkedIn Profile"
        >
          <img src="/linkedin.png" alt="LinkedIn Icon" />
        </a>

        <div className="header-center">
          <img
            src={headerImageUrl || '/header.gif'}
            alt="Header GIF"
            className="header-gif"
          />
          <h1 className="title">{title || 'Loading...'}</h1>
        </div>
      </div>
      <Chat title={title} initialMessage={initialMessage} />
    </div>
  );
}

export default PublicChat;
