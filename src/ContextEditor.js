// ContextEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContextEditor.css';
import { auth } from './firebase.js';

function ContextEditor() {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState('');
  const [publicLink, setPublicLink] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the current data when the component mounts
  useEffect(() => {
    const fetchData = async (key, setter) => {
      try {
        if (!auth || !auth.currentUser) {
          console.error('No current user found for fetch, or Firebase not initialized correctly');
          return;
        }
        const idToken = await auth.currentUser.getIdToken(); // Get user's ID token

        console.log(`Fetching data for key: ${key}`);
        const response = await axios.get(`/api/settings?key=${key}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
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

  // Generic handler to update any value in the database
  const handleUpdate = async (key, value) => {
    try {
      setLoading(true);
      if (!auth || !auth.currentUser) {
        console.error('No current user found for update, or Firebase not initialized correctly');
        return;
      }
      const idToken = await auth.currentUser.getIdToken(); // Get user's ID token

      console.log(`Attempting to update ${key} with value:`, value);
      console.log('Sending request to /api/settings with headers:', {
        Authorization: `Bearer ${idToken}`,
      });
      await axios.post('/api/settings', { key, value }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
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

  // Handler to generate the public link
  const handleGeneratePublicLink = async () => {
    try {
      if (!auth || !auth.currentUser) {
        console.error('No current user found for generating public link, or Firebase not initialized correctly');
        return;
      }
      const idToken = await auth.currentUser.getIdToken(); // Get user's ID token

      console.log('Generating public link');
      console.log('Sending request to /api/settings (PUT) with headers:', {
        Authorization: `Bearer ${idToken}`,
      });
      const response = await axios.put('/api/settings', {}, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      setPublicLink(response.data.publicLink);
    } catch (error) {
      console.error('Error generating public link:', error); // Log the error for debugging
      if (error.response) {
        console.error('Error response from server:', error.response.data);
      }
      alert(`Failed to generate public link: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
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
          placeholder="Edit the AppleseedGPT context..."
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

      <div className="form-section">
        <h2>Email Editor</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Edit the email..."
        />
        <button onClick={() => handleUpdate('email', email)} disabled={loading}>
          {loading ? 'Updating...' : 'Update Email'}
        </button>
      </div>

      <div className="form-section">
        <h2>Link Editor</h2>
        <input
          type="text"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Edit the link..."
        />
        <button onClick={() => handleUpdate('link', link)} disabled={loading}>
          {loading ? 'Updating...' : 'Update Link'}
        </button>
      </div>

      <div className="form-section">
        <h2>Header Image URL Editor</h2>
        <input
          type="text"
          value={headerImageUrl}
          onChange={(e) => setHeaderImageUrl(e.target.value)}
          placeholder="Edit the Header Image URL..."
        />
        <button onClick={() => handleUpdate('headerImage', headerImageUrl)} disabled={loading}>
          {loading ? 'Updating...' : 'Update Header Image URL'}
        </button>
      </div>

      <div className="form-section">
        <h2>Generate Public Link</h2>
        <button onClick={handleGeneratePublicLink} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Public Link'}
        </button>
        {publicLink && (
          <div className="public-link">
            <p>Your Public Chatbot Link:</p>
            <a href={`/${publicLink}`} target="_blank" rel="noopener noreferrer">
              {`${window.location.origin}/${publicLink}`}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContextEditor;

