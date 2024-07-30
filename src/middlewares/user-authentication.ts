import jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';
import { ExpressRequest } from '@interfaces/common-interface'
import appEnv from '@utils/appEnv';

interface RefreshTokenPayload {
  userId: string;
}

class AuthMiddleware {
  private readonly jwtSecret: string;
  private readonly refreshTokenSecretKey: string;

  constructor() {
    this.jwtSecret = appEnv('JWT_SECRET');
    this.refreshTokenSecretKey = appEnv('JWT_REFRESH_TOKEN')
  }

  public generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '7d' });
  }

  public generateRefreshToken(userId: string): string {
    return jwt.sign({ userId }, this.refreshTokenSecretKey, { expiresIn: '7d' });
  }

  public verifyToken(token: string): string | object {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    try {
      const payload = jwt.verify(token, this.refreshTokenSecretKey) as RefreshTokenPayload;
      return payload;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  public refreshAccessToken(refreshToken: string): string {
    const payload = this.verifyRefreshToken(refreshToken);
    const newAccessToken = this.generateToken(payload.userId);
    return newAccessToken;
  }

  public requireAuth = (req: ExpressRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    try {
      const decoded = this.verifyToken(token);
      req.userId = (decoded as { userId: string }).userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }
}

export const authService = new AuthMiddleware();
