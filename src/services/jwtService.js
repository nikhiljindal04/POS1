import { generateToken, verifyToken } from '../utils/generateToken.js';
import logger from '../utils/logger.js';

class JWTService {
  generateAccessToken(user) {
    try {
      const payload = {
        userId: user.user_id,
        restaurantId: user.restaurant_id,
        username: user.username,
        role: user.role,
        email: user.email
      };
      return generateToken(payload);
    } catch (error) {
      logger.error('Token generation failed:', error);
      throw error;
    }
  }

  verifyAccessToken(token) {
    try {
      return verifyToken(token);
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw error;
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}

export default new JWTService();
