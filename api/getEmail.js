// api/getEmail.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    const email = await kv.get('appleseed_email'); // Fetch the email from the database
    res.status(200).json({ email });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch email.' });
  }
}