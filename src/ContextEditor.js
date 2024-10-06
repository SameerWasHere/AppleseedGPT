// ContextEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContextEditor.css';
import { auth } from './firebase.js';

function ContextEditor({ user, handleSignOut }) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [publicLink, setPublicLink] = useState('');

  // Utility to get user's email prefix
  const getUserEmailPrefix = () => {
    if (!auth.currentUser || !auth.currentUser.email) {
      console.error('No current user or user email found.');
      return null;
    }
    return auth.currentUser.email.split('@')[0];
  };

  // Fetch the current data when the component mounts
  useEffect(() => {
    const fetchData = async (key, setter) => {
      try {
        const emailPrefix = getUserEmailPrefix();
        if (!emailPrefix) {
          return;
        }

        console.log(`Fetching data for key: ${key}`);
        const response = await axios.get(`/api/settings?key=${key}&emailPrefix=${emailPrefix}`);
        setter(response.data[key]);
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
        if (error.response) {
          console.error('Error response from server:', error.response.data);
        }
        alert(`Failed to fetch ${key}: ${error.response?.data?.error || error.message}`);
      }
    };

    fetchData('title', setTitle);
    fetchData('context', setContext);
    fetchData('initial_message', setInitialMessage);
    fetchData('email', setEmail);
    fetchData('link', setLink);
    fetchData('headerImage', setHeaderImageUrl);
  }, []);

  // Fetch the public link for the chatbot when the component mounts
  useEffect(() => {
    const fetchPublicLink = async () => {
      try {
        const emailPrefix = getUserEmailPrefix();
        if (!emailPrefix) {
          return;
        }
        const response = await axios.get(`/api/settings?key=public_link&emailPrefix=${emailPrefix}`);
        if (response.data && response.data.public_link) {
          setPublicLink(`/chat/${response.data.public_link}`);
        }
      } catch (error) {
        console.error('Failed to fetch public link:', error);
      }
    };

    fetchPublicLink();
  }, []);

  // Generic handler to update any value in the database
  const handleUpdate = async (key, value) => {
    try {
      setLoading(true);
      const emailPrefix = getUserEmailPrefix();
      if (!emailPrefix) {
        return;
      }

      console.log(`Attempting to update ${key} with value:`, value);
      console.log('Sending request to /api/settings with emailPrefix:', emailPrefix);
      await axios.post('/api/settings', { key, value, emailPrefix });
      alert(`${key} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update ${key}:`, error); // Log the error for debugging
      if (error.response) {
        console.error('Error response from server:', error.response.data);
      }
      alert(`Failed to update ${key}: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="context-editor-page">
      {/* User Info Section */}
      {user && (
        <div className="user-info">
          <span className="welcome-message">Welcome, {user.displayName || user.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      )}

      {/* Public Bot Link Section */}
      {publicLink && (
        <div className="public-bot-link">
          <a href={publicLink} target="_blank" rel="noopener noreferrer">Visit your public chatbot</a>
        </div>
      )}

      {/* Context Editor Form */}
      <div className="context-editor">
        <div className="form-section">
          <h2>Title Editor</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit the title..."
          />
          <button onClick={() => handleUpdate('title', title)} disabled={loading}>
            {loading ? 'Updating...' : 'Update Title'}
          </button>
        </div>

        <div className="form-section">
          <h2>Context Editor</h2>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Edit the context..."
          />
          <button onClick={() => handleUpdate('context', context)} disabled={loading}>
            {loading ? 'Updating...' : 'Update Context'}
          </button>
        </div>

        <div className="form-section">
          <h2>Initial Message Editor</h2>
          <textarea
            value={initialMessage}
            onChange={(e) => setInitialMessage(e.target.value)}
            placeholder="Edit the initial message..."
          />
          <button onClick={() => handleUpdate('initial_message', initialMessage)} disabled={loading}>
            {loading ? 'Updating...' : 'Update Initial Message'}
          </button>
        </div>

        {/* Additional sections for editing user settings */}
      </div>
    </div>
  );
}

export default ContextEditor;
 