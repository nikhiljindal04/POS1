import express from 'express';
import tableController from '../controllers/tableController.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { USER_ROLES } from '../utils/constants.js';
import {
  createTableSchema,
  updateTableSchema,
  updateTableStatusSchema,
  getTablesQuerySchema
} from '../validators/tableValidator.js';

const router = express.Router();

// All table routes require authentication
router.use(authenticate);

// Get all tables (accessible by all authenticated users)
router.get('/', 
  validate(getTablesQuerySchema, 'query'), 
  tableController.getAllTables
);

// Get table by ID (accessible by all authenticated users)
router.get('/:tableId', tableController.getTableById);

// Admin/Manager only routes
const adminManagerAuth = authorize([USER_ROLES.ADMIN, USER_ROLES.MANAGER]);
const adminManagerCashierAuth = authorize([USER_ROLES.ADMIN, USER_ROLES.MANAGER, USER_ROLES.CASHIER]);

// Create table (Admin/Manager only)
router.post('/', 
  adminManagerAuth,
  validate(createTableSchema), 
  tableController.createTable
);

// Update table (Admin/Manager only)
router.put('/:tableId', 
  adminManagerAuth,
  validate(updateTableSchema), 
  tableController.updateTable
);

// Delete table (Admin/Manager only)
router.delete('/:tableId', 
  adminManagerAuth,
  tableController.deleteTable
);

// Update table status (Admin/Manager only)
router.patch('/:tableId/status', 
  adminManagerCashierAuth,
  validate(updateTableStatusSchema), 
  tableController.updateTableStatus
);

export default router;
