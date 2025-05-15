import jwt from 'jsonwebtoken';

export const generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
}

export const resetToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_RESET_SECRET, { expiresIn });
}