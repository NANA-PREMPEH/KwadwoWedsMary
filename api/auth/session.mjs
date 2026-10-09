import { verifyAdminSession } from '../../server/adminAuth.mjs';

export default function handler(req, res) {
  return res.status(200).json({ authenticated: verifyAdminSession(req) });
}
