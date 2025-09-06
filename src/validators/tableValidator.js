import Joi from 'joi';

export const createTableSchema = Joi.object({
  table_number: Joi.string().min(1).max(20).required(),
  capacity: Joi.number().integer().min(1).max(50).required(),
  section: Joi.string().max(50).optional().allow(''),
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').default('available'),
  qr_code_url: Joi.string().uri().max(500).optional().allow('')
});

export const updateTableSchema = Joi.object({   
  table_number: Joi.string().min(1).max(20).optional(),
  capacity: Joi.number().integer().min(1).max(50).optional(),
  section: Joi.string().max(50).optional().allow(''),
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').optional(),
  qr_code_url: Joi.string().uri().max(500).optional().allow('')
});

export const updateTableStatusSchema = Joi.object({
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').required()
});

export const getTablesQuerySchema = Joi.object({
  status: Joi.string().valid('available', 'occupied', 'reserved', 'maintenance').optional(),
  section: Joi.string().max(50).optional(),
  page: Joi.number().integer().min(1).max(1000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50)
});
