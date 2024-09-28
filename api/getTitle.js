// api/getTitle.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const title = await kv.get('appleseed_title');
    res.status(200).json({ title });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch title.' });
  }
}