// api/context.js
import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Handle GET request to retrieve the context
      const context = await kv.get('appleseed_context');
      res.status(200).json({ context });
    } else if (req.method === 'POST') {
      // Handle POST request to update the context
      const { context } = req.body;
      await kv.set('appleseed_context', context);
      res.status(200).json({ message: 'Context updated successfully.' });
    } else {
      // If method is not allowed, return a 405 error
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
}
