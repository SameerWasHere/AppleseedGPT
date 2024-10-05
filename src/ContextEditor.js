// ContextEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ContextEditor.css'; // Ensure the CSS file is properly linked

function ContextEditor() {
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [headerImageUrl, setHeaderImageUrl] = useState(''); // State for Header Image URL
  const [loading, setLoading] = useState(false);

  // Fetch the current data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const titleResponse = await axios.get('/api/getTitle');
        setTitle(titleResponse.data.title);

        const contextResponse = await axios.get('/api/getContext');
        setContext(contextResponse.data.context);

        const messageResponse = await axios.get('/api/getInitialMessage');
        setInitialMessage(messageResponse.data.initialMessage);

        const emailResponse = await axios.get('/api/getEmail');
        setEmail(emailResponse.data.email);

        const linkResponse = await axios.get('/api/getLink');
        setLink(linkResponse.data.link);

        const headerImageResponse = await axios.get('/api/getHeaderImage'); // Fetch the header image URL
        setHeaderImageUrl(headerImageResponse.data.appleseed_headerImage);
      } catch (error) {
        alert('Failed to fetch data from the database.');
      }
    };

    fetchData();
  }, []);

  // Handler to update the title in the database
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

  // Other update handlers (context, initial message, email, link)...

  // Handler to update the header image URL in the database
  const handleUpdateHeaderImage = async () => {
    try {
      setLoading(true);
      await axios.post('/api/updateHeaderImage', { headerImageUrl }); // Create this endpoint to update header image URL
      alert('Header Image URL updated successfully.');
    } catch (error) {
      alert('Failed to update the Header Image URL.');
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

      <div className="form-section">
        <h2>Email Editor</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Edit the email..."
        />
        <button onClick={handleUpdateEmail} disabled={loading}>
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
        <button onClick={handleUpdateLink} disabled={loading}>
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
        <button onClick={handleUpdateHeaderImage} disabled={loading}>
          {loading ? 'Updating...' : 'Update Header Image URL'}
        </button>
      </div>
    </div>
  );
}

export default ContextEditor;
