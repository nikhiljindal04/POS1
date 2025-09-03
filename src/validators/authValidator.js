import Joi from 'joi';

export const signUpSchema = Joi.object({
  restaurantData: Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().min(10).max(20).optional(),
    address: Joi.string().max(1000).optional(),
    timezone: Joi.string().max(50).optional(),
    subscription_plan: Joi.string().valid('basic', 'premium', 'enterprise').optional(),
    currency: Joi.string().length(3).default('INR').optional()
  }).required(),
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).required(),
  fullName: Joi.string().min(2).max(255).optional(),
  role: Joi.string().valid('admin').default('admin')
});

export const signInSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});
