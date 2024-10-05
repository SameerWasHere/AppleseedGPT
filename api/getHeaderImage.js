// api/getHeaderImage.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    // Fetch the appleseed_headerImage from the KV database
    const headerImage = await kv.get('appleseed_headerImage');
    
    // Return the fetched header image URL in JSON format
    res.status(200).json({ appleseed_headerImage: headerImage });
  } catch (error) {
    // Handle any errors that occur during fetching
    res.status(500).json({ error: 'Failed to fetch header image.' });
  }
}
