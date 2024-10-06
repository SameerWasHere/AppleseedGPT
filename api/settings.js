// api/settings.js (Backend changes)
import { kv } from '@vercel/kv';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { v4 as uuidv4 } from 'uuid';

// Initialize Firebase Admin
try {
  initializeApp({
    credential: applicationDefault(),
  });
} catch (error) {
  if (!/already exists/u.test(error.message)) {
    console.error('Firebase initialization error:', error);
  }
}

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('Authorization header is missing.');
      return res.status(401).json({ error: 'Authorization header is required.' });
    }

    const idToken = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (error) {
      console.error('Failed to verify ID token:', error);
      return res.status(401).json({ error: 'Invalid or expired ID token.' });
    }

    const userId = decodedToken.uid;

    if (req.method === 'GET') {
      const { key } = req.query;

      if (!key) {
        console.error('Key is required for fetching data.');
        return res.status(400).json({ error: 'A key is required to fetch data.' });
      }

      try {
        console.log(`Fetching data for user ${userId} with key: ${key}`);
        const value = await kv.get(`${userId}_${key}`);
        if (value !== undefined) {
          res.status(200).json({ [key]: value });
        } else {
          console.warn(`Key not found for user ${userId}: ${key}`);
          res.status(404).json({ error: 'Key not found.' });
        }
      } catch (error) {
        console.error('Error fetching data from KV store:', error);
        return res.status(500).json({ error: 'Failed to fetch data from KV store.' });
      }
    } else if (req.method === 'POST') {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        console.error('Both key and value are required to update data.');
        return res.status(400).json({ error: 'Both key and value are required to update data.' });
      }

      try {
        console.log(`Updating data for user ${userId} with key: ${key}, value: ${value}`);
        await kv.set(`${userId}_${key}`, value);
        res.status(200).json({ message: 'Value updated successfully.' });
      } catch (error) {
        console.error('Error updating KV store:', error);
        return res.status(500).json({ error: 'Failed to update KV store.' });
      }
    } else if (req.method === 'PUT') {
      // Generate a unique link for the user if it doesn't exist
      const publicLinkKey = `${userId}_public_link`;
      try {
        console.log(`Generating public link for user ${userId}`);
        let publicLink = await kv.get(publicLinkKey);

        if (!publicLink) {
          publicLink = `chat/${uuidv4()}`;
          await kv.set(publicLinkKey, publicLink);
        }

        res.status(200).json({ publicLink });
      } catch (error) {
        console.error('Error generating or saving public link:', error);
        return res.status(500).json({ error: 'Failed to generate or save public link.' });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('General error processing request:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
}

