// api/settings.js
import { kv } from '@vercel/kv';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin
initializeApp();

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
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}
