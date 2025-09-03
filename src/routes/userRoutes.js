import express from 'express';
import userController from '../controllers/userController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { updateProfileSchema, changePasswordSchema } from '../validators/userValidator.js';

const router = express.Router();

// All user routes require authentication
router.get("/", (req, res) => res.json({ message: "Welcome to the User API" }));
router.use(authenticate);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

export default router;
