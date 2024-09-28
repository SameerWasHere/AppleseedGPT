// api/updateTitle.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title } = req.body;
    try {
      await kv.set('appleseed_title', title);
      res.status(200).json({ message: 'Title updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update title.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}