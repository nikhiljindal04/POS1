import Joi from 'joi';

export const updateProfileSchema = Joi.object({
  full_name: Joi.string().min(2).max(255).optional(),
  email: Joi.string().email().optional()
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});
