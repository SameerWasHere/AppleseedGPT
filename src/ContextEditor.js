// ContextEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContextEditor.css'; // Import the new CSS file

function ContextEditor() {
  const [title, setTitle] = useState(''); 
  const [context, setContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleResponse = await axios.get('/api/getTitle');
        setTitle(titleResponse.data.title);

        const contextResponse = await axios.get('/api/getContext');
        setContext(contextResponse.data.context);

        const messageResponse = await axios.get('/api/getInitialMessage');
        setInitialMessage(messageResponse.data.initialMessage);
      } catch (error) {
        alert('Failed to fetch data from the database.');
      }
    };

    fetchData();
  }, []);

  const handleUpdateTitle = async () => {
    try {
      setLoading(true);
      await axios.post('/api/updateTitle', { title });
      alert('Title updated successfully.');
    } catch (error) {
      alert('Failed to update the title.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateContext = async () => {
    try {
      setLoading(true);
      await axios.post('/api/updateContext', { context });
      alert('Context updated successfully.');
    } catch (error) {
      alert('Failed to update context.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInitialMessage = async () => {
    try {
      setLoading(true);
      await axios.post('/api/updateInitialMessage', { initialMessage });
      alert('Initial message updated successfully.');
    } catch (error) {
      alert('Failed to update the initial message.');
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
        <button onClick={handleUpdateTitle} disabled={loading}>
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
        <button onClick={handleUpdateContext} disabled={loading}>
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
        <button onClick={handleUpdateInitialMessage} disabled={loading}>
          {loading ? 'Updating...' : 'Update Initial Message'}
        </button>
      </div>
    </div>
  );
}

export default ContextEditor;