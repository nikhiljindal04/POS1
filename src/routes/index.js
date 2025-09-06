import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import menuRoutes from './menuRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/menu', menuRoutes);

export default router;
