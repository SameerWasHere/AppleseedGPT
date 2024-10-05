// api/updateHeaderImage.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { headerImageUrl } = req.body;

    if (!headerImageUrl) {
      return res.status(400).json({ error: 'Header image URL is required.' });
    }

    // Update the appleseed_headerImage value in the KV database
    await kv.set('appleseed_headerImage', headerImageUrl);

    res.status(200).json({ message: 'Header image URL updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update header image URL.' });
  }
}
