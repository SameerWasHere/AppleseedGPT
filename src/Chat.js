// Chat.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

function Chat({ username, title, initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userContext, setUserContext] = useState('');
  const chatWindowRef = useRef(null); // Reference to the chat window
  const lastMessageRef = useRef(null); // Reference to the last message

  // Fetch user's personalized context when the component mounts
  useEffect(() => {
    const fetchUserContext = async () => {
      if (!username) {
        console.error('Username is missing.');
        return;
      }

      try {
        const response = await axios.get(`/api/settings?key=context&emailPrefix=${username}`);
        if (response.data && response.data.context) {
          setUserContext(response.data.context);
        } else {
          console.error('Failed to load user context.');
        }
      } catch (error) {
        console.error('An error occurred while fetching the user context:', error);
      }
    };

    fetchUserContext();
  }, [username]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      // Send updated messages along with user context to the backend
      const response = await axios.post('/api/chat', {
        context: userContext,
        messages: updatedMessages,
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const assistantMessage = response.data.choices[0].message;
        setMessages([...updatedMessages, assistantMessage]);
      } else {
        alert('Received an unexpected response from the server.');
      }
    } catch (error) {
      alert('An error occurred while fetching the response.');
    }
  };

  // Set the initial message if provided
  useEffect(() => {
    if (initialMessage) {
      const message = {
        role: 'assistant',
        content: initialMessage,
      };

      // Set a delay before displaying the initial message
      const timer = setTimeout(() => {
        setMessages([message]);
      }, 2000);

      // Clean up the timer when the component is unmounted
      return () => clearTimeout(timer);
    }
  }, [initialMessage]);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    if (messages.length > 1 && lastMessageRef.current) {
      // Scroll the last message into view
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Add extra scroll to make sure the message is fully visible
      setTimeout(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop += 50; // Adjust this value if needed
        }
      }, 200);
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role}`}
            ref={index === messages.length - 1 ? lastMessageRef : null} // Reference the last message
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          placeholder={`Ask ${title || 'GPT'}...`} // Use the fetched title or a fallback
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chat;

