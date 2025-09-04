import prisma from '../config/database.js';
import passwordService from './passwordService.js';
import jwtService from './jwtService.js';
import logger from '../utils/logger.js';
import { HTTP_STATUS, ERROR_MESSAGES, USER_ROLES } from '../utils/constants.js';

class AuthService {
  async signUp(userData) {
    try {
      const { 
        restaurantData, 
        username, 
        email, 
        password, 
        full_name, 
        role = USER_ROLES.ADMIN 
      } = userData;

      // Validate password strength
      const passwordValidation = passwordService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { username }
      });

      if (existingUser) {
        throw new Error(ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }

      // Hash password
      const hashedPassword = await passwordService.hashPassword(password);

      // Create restaurant and user in a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create restaurant first
        const restaurant = await tx.restaurant.create({
          data: {
            name: restaurantData.name,
            email: restaurantData.email,
            phone: restaurantData.phone,
            address: restaurantData.address,
            timezone: restaurantData.timezone || 'Asia/Kolkata',
            subscription_plan: restaurantData.subscription_plan || 'basic',
            currency: restaurantData.currency || 'INR',
            is_active: true
          }
        });

        // Create user
        const user = await tx.user.create({
          data: {
            restaurant_id: restaurant.restaurant_id,
            username,
            email,
            password_hash: hashedPassword,
            role,
            full_name,
            is_active: true
          },
          include: {
            restaurant: true
          }
        });

        return { restaurant, user };
      });

      // Generate JWT token
      const token = jwtService.generateAccessToken(result.user);

      logger.info(`New user registered: ${username} for restaurant: ${result.restaurant.name}`);

      return {
        success: true,
        data: {
          user: {
            user_id: result.user.user_id,
            username: result.user.username,
            email: result.user.email,
            full_name: result.user.full_name,
            role: result.user.role,
            restaurant: {
              restaurant_id: result.restaurant.restaurant_id,
              name: result.restaurant.name,
              email: result.restaurant.email
            }
          },
          token
        }
      };
    } catch (error) {
      logger.error('Sign up failed:', error);
      throw error;
    }
  }

  async signIn(credentials) {
    try {
      const { username, password } = credentials;

      // Find user with restaurant data
      const user = await prisma.user.findUnique({
        where: { username },
        include: {
          restaurant: true
        }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      if (!user.is_active) {
        throw new Error('Account is deactivated');
      }

      if (!user.restaurant.is_active) {
        throw new Error('Restaurant account is deactivated');
      }

      // Verify password
      const isPasswordValid = await passwordService.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Generate JWT token
      const token = jwtService.generateAccessToken(user);

      logger.info(`User signed in: ${username}`);

      return {
        success: true,
        data: {
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            restaurant: {
              restaurant_id: user.restaurant.restaurant_id,
              name: user.restaurant.name,
              email: user.restaurant.email,
              subscription_plan: user.restaurant.subscription_plan
            }
          },
          token
        }
      };
    } catch (error) {
      logger.error('Sign in failed:', error);
      throw error;
    }
  }

  

}

export default new AuthService();
