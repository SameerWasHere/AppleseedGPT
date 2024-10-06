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
  console.error('Firebase initialization error:', error);
}

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header is required.' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    if (req.method === 'GET') {
      const { key } = req.query;

      if (!key) {
        return res.status(400).json({ error: 'A key is required to fetch data.' });
      }

      const value = await kv.get(`${userId}_${key}`);
      if (value !== undefined) {
        res.status(200).json({ [key]: value });
      } else {
        res.status(404).json({ error: 'Key not found.' });
      }
    } else if (req.method === 'POST') {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        return res.status(400).json({ error: 'Both key and value are required to update data.' });
      }

      await kv.set(`${userId}_${key}`, value);
      res.status(200).json({ message: 'Value updated successfully.' });
    } else if (req.method === 'PUT') {
      // Generate a unique link for the user if it doesn't exist
      const publicLinkKey = `${userId}_public_link`;
      let publicLink = await kv.get(publicLinkKey);

      if (!publicLink) {
        publicLink = `chat/${uuidv4()}`;
        await kv.set(publicLinkKey, publicLink);
      }

      res.status(200).json({ publicLink });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('Error processing request:', error); // Log detailed error information
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
}

