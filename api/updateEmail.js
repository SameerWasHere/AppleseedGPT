// api/updateEmail.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;
    try {
      await kv.set('appleseed_email', email); // Store the updated email in the database
      res.status(200).json({ message: 'Email updated successfully.' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update email.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}