// api/updateLink.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { link } = req.body;
    try {
      await kv.set('appleseed_link', link); // Store the updated link in the database
      res.status(200).json({ message: 'Link updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update link.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}