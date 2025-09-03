import jwt from 'jsonwebtoken';
import { config } from './environment.js';

export const jwtConfig = {
  secret: config.JWT_SECRET,
  expiresIn: config.JWT_EXPIRES_IN,
  algorithm: 'HS256'
};
