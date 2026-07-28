import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-super-secret-key-at-least-32-characters-long';
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '24h';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '30d';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RefreshTokenPayload {
  userId: string;
  jti: string;
}

/**
 * Signs a short-lived access JWT.
 */
export const signAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_ACCESS_EXPIRY as any,
  });
};

/**
 * Verifies an access JWT.
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};

/**
 * Signs a long-lived refresh JWT and returns the token and its unique JTI.
 */
export const signRefreshToken = (userId: string): { token: string; jti: string } => {
  const jti = crypto.randomUUID();
  const token = jwt.sign({ userId, jti }, JWT_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRY as any,
  });
  return { token, jti };
};

/**
 * Decodes a refresh JWT (even if expired or invalid signature, for safety checks).
 */
export const decodeRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.decode(token) as RefreshTokenPayload;
  } catch {
    return null;
  }
};

/**
 * Verifies a refresh JWT.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as RefreshTokenPayload;
};
