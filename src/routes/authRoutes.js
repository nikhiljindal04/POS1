import express from 'express';
import authController from '../controllers/authController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { signUpSchema, signInSchema } from '../validators/authValidator.js';

const router = express.Router();

// Public routes
router.post('/signup', authLimiter, validate(signUpSchema), authController.signUp);
router.post('/signin', authLimiter, validate(signInSchema), authController.signIn);

// Protected routes
router.post('/signout', authenticate, authController.signOut);

export default router;