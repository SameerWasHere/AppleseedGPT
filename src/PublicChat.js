// PublicChat.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams to get route parameters
import Chat from './Chat.js';
import './PublicChat.css';

function PublicChat() {
  const { username } = useParams(); // Extract the username from the URL parameters
  const [title, setTitle] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the settings based on emailPrefix (username) when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!username) {
          console.error('Username is missing.');
          setError('Username is missing.');
          setLoading(false);
          return;
        }

        console.log(`Fetching data for username: ${username}`);
        
        const fetchSetting = async (key, setter) => {
          try {
            const response = await axios.get(`/api/settings?key=${key}&emailPrefix=${username}`);
            if (response.data && response.data[key] !== undefined) {
              setter(response.data[key]);
            } else {
              console.error(`Failed to load ${key}.`);
              setError(`Failed to load ${key}.`);
            }
          } catch (fetchError) {
            console.error(`Error fetching key "${key}":`, fetchError);
            setError(`Failed to load ${key}.`);
          }
        };

        await Promise.all([
          fetchSetting('title', setTitle),
          fetchSetting('initial_message', setInitialMessage),
          fetchSetting('headerImage', setHeaderImageUrl),
          fetchSetting('link', setLink),
          fetchSetting('email', setEmail)
        ]);

        setLoading(false);

      } catch (error) {
        console.error('An error occurred while fetching the data:', error);
        setError('An error occurred while fetching the data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  if (loading) {
    return <div className="public-chat-container"><p>Loading...</p></div>;
  }

  if (error) {
    return <div className="public-chat-container"><p>{error}</p></div>;
  }

  return (
    <div className="public-chat-container">
      {/* Header Area */}
      <div className="header-area">
        {/* Mail Icon */}
        {email && (
          <a
            href={`mailto:${email}`}
            className="left-icon"
            aria-label="Send Email"
          >
            <img src="/mail.png" alt="Mail Icon" />
          </a>
        )}

        <div className="header-center">
          {headerImageUrl && (
            <img
              src={headerImageUrl}
              alt="Header GIF"
              className="header-gif"
            />
          )}
          <h1 className="title">{title || 'Welcome!'}</h1>
        </div>

        {/* LinkedIn Icon */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="right-icon"
            aria-label="LinkedIn Profile"
          >
            <img src="/linkedin.png" alt="LinkedIn Icon" />
          </a>
        )}
      </div>
      <Chat username={username} title={title} initialMessage={initialMessage} />
    </div>
  );
}

export default PublicChat;
