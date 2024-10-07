// ContextEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContextEditor.css';
import { auth, signOut } from './firebase.js';

function ContextEditor({ user, setUser }) {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [publicLink, setPublicLink] = useState('');
  const [loading, setLoading] = useState(false);

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

    // Generate public link automatically
    const generatePublicLink = async () => {
      try {
        const emailPrefix = getUserEmailPrefix();
        const publicLinkResponse = await axios.put('/api/settings', { emailPrefix });
        setPublicLink(`${window.location.origin}/${publicLinkResponse.data.publicLink}`);
      } catch (error) {
        console.error('An error occurred while generating the public link:', error);
      }
    };

    generatePublicLink();
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

  return (
    <div className="context-editor">
      {/* Log out and Public Link Section */}
      <div className="user-controls">
        <h2 className="welcome-text">Welcome, {user.displayName}</h2>
        <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
        {publicLink && (
          <div className="public-link-container">
            <div className="public-link">
              <a href={publicLink} target="_blank" rel="noopener noreferrer">
                {publicLink}
              </a>
              <button className="copy-button" onClick={copyToClipboard}>Copy Link</button>
            </div>
          </div>
        )}
      </div>

      {/* Context Editing Forms */}
      <div className="form-section">
        <h2>Title Editor</h2>
        <p>A descriptive name for your chatbot (Example: JohnnyAppleseedGPT)</p>
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

      {/* Additional Editing Forms here as in original */}
    </div>
  );
}

export default ContextEditor;
