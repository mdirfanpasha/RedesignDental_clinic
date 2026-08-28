/**
 * api/booking.js
 * Unified Vercel Serverless Function & Local Endpoint for Bookings & Callbacks
 */

import appointmentHandler from './appointments.js';
import callbackHandler from './callback.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const type = body.type || req.query?.type || 'appointment';

    if (type === 'callback') {
      return await callbackHandler(req, res);
    } else {
      return await appointmentHandler(req, res);
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
