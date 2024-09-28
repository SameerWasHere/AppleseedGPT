// api/updateInitialMessage.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { initialMessage } = req.body;
    try {
      await kv.set('appleseed_initial_message', initialMessage);
      res.status(200).json({ message: 'Initial message updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update initial message.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}