import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import menuRoutes from './menuRoutes.js';
import tableRoutes from './tableRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/menu', menuRoutes);
router.use('/tables', tableRoutes);

export default router;
