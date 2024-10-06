// api/settings.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { key } = req.query;

      if (!key) {
        return res.status(400).json({ error: 'A key is required to fetch data.' });
      }

      const value = await kv.get(key);
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

      await kv.set(key, value);
      res.status(200).json({ message: 'Value updated successfully.' });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}
