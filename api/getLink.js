// api/getLink.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const link = await kv.get('appleseed_link'); // Fetch the link from the database
    res.status(200).json({ link });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch link.' });
  }
}