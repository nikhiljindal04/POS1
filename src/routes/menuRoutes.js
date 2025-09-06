import express from 'express';
import menuController from '../controllers/menuController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/constants.js';
import {
  createCategorySchema,
  updateCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  createModifierGroupSchema,
  updateModifierGroupSchema,
  createModifierSchema,
  updateModifierSchema
} from '../validators/menuValidator.js';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// Full menu route (can be accessed by all authenticated users for display purposes)
router.get('/full-menu', authenticate, menuController.getFullMenu);

// Apply admin or manager authorization to all routes (only admin/manager can manage menu)
router.use(authorize([USER_ROLES.ADMIN, USER_ROLES.MANAGER]));

// ==================== MENU CATEGORIES ====================

// Category routes
router.post('/categories', validate(createCategorySchema), menuController.createCategory);
router.get('/categories', menuController.getCategories);
router.put('/categories/:categoryId', validate(updateCategorySchema), menuController.updateCategory);
router.delete('/categories/:categoryId', menuController.deleteCategory);

// ==================== MENU ITEMS ====================

// Menu item routes
router.post('/items', validate(createMenuItemSchema), menuController.createMenuItem);
router.get('/items', menuController.getMenuItems);
router.get('/items/:itemId', menuController.getMenuItem);
router.put('/items/:itemId', validate(updateMenuItemSchema), menuController.updateMenuItem);
router.delete('/items/:itemId', menuController.deleteMenuItem);

// ==================== MODIFIER GROUPS ====================

// Modifier group routes
router.post('/modifier-groups', validate(createModifierGroupSchema), menuController.createModifierGroup);
router.get('/modifier-groups', menuController.getModifierGroups);
router.put('/modifier-groups/:groupId', validate(updateModifierGroupSchema), menuController.updateModifierGroup);
router.delete('/modifier-groups/:groupId', menuController.deleteModifierGroup);

// ==================== MENU MODIFIERS ====================

// Modifier routes
router.post('/modifiers', validate(createModifierSchema), menuController.createModifier);
router.get('/modifiers', menuController.getModifiers);
router.put('/modifiers/:modifierId', validate(updateModifierSchema), menuController.updateModifier);
router.delete('/modifiers/:modifierId', menuController.deleteModifier);

export default router;
