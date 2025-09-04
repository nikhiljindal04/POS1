import express from 'express';
import userController from '../controllers/userController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/constants.js';
import { 
  updateProfileSchema, 
  changePasswordSchema, 
  createUserSchema, 
  updateUserSchema 
} from '../validators/userValidator.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Personal profile routes (available to all authenticated users)
router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

// User management routes (admin only)
router.post(
  '/', 
  authorize([USER_ROLES.ADMIN]), 
  validate(createUserSchema), 
  userController.createUser
);

router.get(
  '/',
  authorize([USER_ROLES.ADMIN]), 
  userController.getAllUsers
);

router.get(
  '/:userId', 
  authorize([USER_ROLES.ADMIN]), 
  userController.getUserById
);

router.put(
  '/:userId', 
  authorize([USER_ROLES.ADMIN]), 
  validate(updateUserSchema), 
  userController.updateUser
);

router.delete(
  '/:userId', 
  authorize([USER_ROLES.ADMIN]), 
  userController.deleteUser
);

export default router;
