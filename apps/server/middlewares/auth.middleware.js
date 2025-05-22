import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Session from '../models/Session.js';
import User from '../models/User.js';

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify JWT
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Find active session in DB
    const session = await Session.findOne({ sessionId: payload.sessionId });
    if (!session) {
      return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' });
    }

    // Check if the session is still valid
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Attach user and session info to request
    req.user = { id: user._id, email: user.email };
    req.sessionId = payload.sessionId;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default authMiddleware;
