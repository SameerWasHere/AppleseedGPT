// api/getInitialMessage.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const initialMessage = await kv.get('appleseed_initial_message');
    res.status(200).json({ initialMessage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch initial message.' });
  }
}