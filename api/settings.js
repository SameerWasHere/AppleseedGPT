// api/settings.js (Backend changes)
import { kv } from '@vercel/kv';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  try {
    const emailPrefix = req.query.emailPrefix || req.body.emailPrefix;
    if (!emailPrefix) {
      console.error('Email prefix is required.');
      return res.status(400).json({ error: 'Email prefix is required.' });
    }

    if (req.method === 'GET') {
      const { key } = req.query;

      if (!key) {
        console.error('Key is required for fetching data.');
        return res.status(400).json({ error: 'A key is required to fetch data.' });
      }

      try {
        console.log(`Fetching data for user ${emailPrefix} with key: ${key}`);
        const value = await kv.get(`${emailPrefix}_${key}`);
        if (value !== undefined) {
          res.status(200).json({ [key]: value });
        } else {
          console.warn(`Key not found for user ${emailPrefix}: ${key}`);
          res.status(404).json({ error: 'Key not found.' });
        }
      } catch (error) {
        console.error('Error fetching data from KV store:', error);
        return res.status(500).json({ error: 'Failed to fetch data from KV store.', details: error.message });
      }
    } else if (req.method === 'POST') {
      const { key, value } = req.body;

      if (!key || value === undefined) {
        console.error('Both key and value are required to update data.');
        return res.status(400).json({ error: 'Both key and value are required to update data.' });
      }

      try {
        console.log(`Updating data for user ${emailPrefix} with key: ${key}, value: ${value}`);
        await kv.set(`${emailPrefix}_${key}`, value);
        res.status(200).json({ message: 'Value updated successfully.' });
      } catch (error) {
        console.error('Error updating KV store:', error);
        return res.status(500).json({ error: 'Failed to update KV store.', details: error.message });
      }
    } else if (req.method === 'PUT') {
      // Generate a unique link for the user if it doesn't exist
      const publicLinkKey = `${emailPrefix}_public_link`;
      try {
        console.log(`Generating public link for user ${emailPrefix}`);
        let publicLink = await kv.get(publicLinkKey);

        if (!publicLink) {
          publicLink = `chat/${uuidv4()}`;
          console.log(`Generated new public link: ${publicLink}`);
          await kv.set(publicLinkKey, publicLink);
        } else {
          console.log(`Existing public link found: ${publicLink}`);
        }

        res.status(200).json({ publicLink });
      } catch (error) {
        console.error('Error generating or saving public link:', error);
        return res.status(500).json({ error: 'Failed to generate or save public link.', details: error.message });
      }
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'PUT']);
      res.status(405).json({ error: `Method ${req.method} not allowed.` });
    }
  } catch (error) {
    console.error('General error processing request:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.', details: error.message });
  }
}