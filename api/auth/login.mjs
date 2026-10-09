import { createAdminSession, credentialsMatch, isAdminConfigured, setAdminCookie } from '../../server/adminAuth.mjs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAdminConfigured()) {
    return res.status(503).json({ error: 'Admin access has not been configured yet.' });
  }

  const { email = '', password = '' } = req.body || {};
  if (!credentialsMatch(email, password)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  setAdminCookie(res, createAdminSession(email.trim().toLowerCase()));
  return res.status(200).json({ authenticated: true });
}
