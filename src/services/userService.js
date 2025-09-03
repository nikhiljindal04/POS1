import prisma from '../config/database.js';
import passwordService from './passwordService.js';
import logger from '../utils/logger.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class UserService {
  async getUserProfile(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: userId },
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          role: true,
          is_active: true,
          created_at: true,
          restaurant: {
            select: {
              restaurant_id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              subscription_plan: true,
              currency: true
            }
          }
        }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      logger.error('Get user profile failed:', error);
      throw error;
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      const { full_name, email } = updateData;

      const updatedUser = await prisma.user.update({
        where: { user_id: userId },
        data: {
          ...(full_name && { full_name }),
          ...(email && { email }),
          updated_at: new Date()
        },
        select: {
          user_id: true,
          username: true,
          email: true,
          full_name: true,
          role: true,
          updated_at: true
        }
      });

      logger.info(`User profile updated: ${userId}`);

      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      logger.error('Update user profile failed:', error);
      throw error;
    }
  }

  async changePassword(userId, passwordData) {
    try {
      const { currentPassword, newPassword } = passwordData;

      // Get current user
      const user = await prisma.user.findUnique({
        where: { user_id: userId }
      });

      if (!user) {
        throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      // Verify current password
      const isCurrentPasswordValid = await passwordService.verifyPassword(
        currentPassword, 
        user.password_hash
      );

      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password strength
      const passwordValidation = passwordService.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join(', '));
      }

      // Hash new password
      const hashedNewPassword = await passwordService.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { user_id: userId },
        data: {
          password_hash: hashedNewPassword,
          updated_at: new Date()
        }
      });

      logger.info(`Password changed for user: ${userId}`);

      return {
        success: true,
        message: 'Password updated successfully'
      };
    } catch (error) {
      logger.error('Change password failed:', error);
      throw error;
    }
  }
}

export default new UserService();
