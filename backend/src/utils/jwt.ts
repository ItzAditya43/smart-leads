import jwt from 'jsonwebtoken';
import config from '../config';
import { JwtPayload, UserRole } from '../types';

export const generateToken = (id: string, role: UserRole): string => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
