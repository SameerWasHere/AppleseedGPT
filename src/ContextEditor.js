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
  const [loading, setLoading] = useState(false);

  // Fetch the current data when the component mounts
  useEffect(() => {
    const fetchData = async (key, setter) => {
      try {
        if (!auth.currentUser) return;
        const idToken = await auth.currentUser.getIdToken(); // Get user's ID token

        const response = await axios.get(`/api/settings?key=${key}`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
        setter(response.data[key]);
      } catch (error) {
        console.error(`Failed to fetch ${key}:`, error);
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
      if (!auth.currentUser) return;
      const idToken = await auth.currentUser.getIdToken(); // Get user's ID token

      await axios.post('/api/settings', { key, value }, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      alert(`${key} updated successfully.`);
    } catch (error) {
      alert(`Failed to update ${key}.`);
    } finally {
      setLoading(false);
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
    </div>
  );
}

export default ContextEditor;
