import Joi from 'joi';
import { USER_ROLES } from '../utils/constants.js';

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  phone: Joi.string().min(10).max(20).optional(),
  email: Joi.string().email().optional()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

// New schemas for user management
export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).required(),
  full_name: Joi.string().min(2).max(255).optional(),
  role: Joi.string().valid(
    USER_ROLES.MANAGER, 
    USER_ROLES.CASHIER, 
    USER_ROLES.WAITER, 
    USER_ROLES.KITCHEN
  ).required()
});

export const updateUserSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional(),
  role: Joi.string().valid(
    USER_ROLES.MANAGER, 
    USER_ROLES.CASHIER, 
    USER_ROLES.WAITER, 
    USER_ROLES.KITCHEN
  ).optional(),
  is_active: Joi.boolean().optional()
});
