import Joi from 'joi';

// Menu Category Validators
export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  display_order: Joi.number().integer().min(0).optional()
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  display_order: Joi.number().integer().min(0).optional(),
  is_active: Joi.boolean().optional()
});

// Menu Item Validators
export const createMenuItemSchema = Joi.object({
  category_id: Joi.string().uuid().optional().allow(null),
  name: Joi.string().min(2).max(255).required(),
  description: Joi.string().max(1000).optional().allow(null),
  price: Joi.number().positive().required(),
  cost: Joi.number().positive().optional().allow(null),
  preparation_time: Joi.number().integer().min(0).optional().allow(null),
  ingredients: Joi.array().items(Joi.string()).optional(),
  allergens: Joi.array().items(Joi.string()).optional(),
  image_url: Joi.string().uri().optional().allow(null),
  is_vegetarian: Joi.boolean().optional(),
  is_vegan: Joi.boolean().optional(),
  is_gluten_free: Joi.boolean().optional(),
  spice_level: Joi.number().integer().min(0).max(5).optional().allow(null),
  calories: Joi.number().integer().min(0).optional().allow(null),
  nutritional_info: Joi.object().optional().allow(null),
  tags: Joi.array().items(Joi.string()).optional(),
  sku: Joi.string().max(100).optional().allow(null),
  display_order: Joi.number().integer().min(0).optional(),
  modifier_groups: Joi.array().items(
    Joi.object({
      group_id: Joi.string().uuid().required(),
      is_required: Joi.boolean().optional(),
      display_order: Joi.number().integer().min(0).optional()
    })
  ).optional()
});

export const updateMenuItemSchema = Joi.object({
  category_id: Joi.string().uuid().optional().allow(null),
  name: Joi.string().min(2).max(255).optional(),
  description: Joi.string().max(1000).optional().allow(null),
  price: Joi.number().positive().optional(),
  cost: Joi.number().positive().optional().allow(null),
  is_available: Joi.boolean().optional(),
  preparation_time: Joi.number().integer().min(0).optional().allow(null),
  ingredients: Joi.array().items(Joi.string()).optional(),
  allergens: Joi.array().items(Joi.string()).optional(),
  image_url: Joi.string().uri().optional().allow(null),
  is_vegetarian: Joi.boolean().optional(),
  is_vegan: Joi.boolean().optional(),
  is_gluten_free: Joi.boolean().optional(),
  spice_level: Joi.number().integer().min(0).max(5).optional().allow(null),
  calories: Joi.number().integer().min(0).optional().allow(null),
  nutritional_info: Joi.object().optional().allow(null),
  tags: Joi.array().items(Joi.string()).optional(),
  sku: Joi.string().max(100).optional().allow(null),
  display_order: Joi.number().integer().min(0).optional(),
  modifier_groups: Joi.array().items(
    Joi.object({
      group_id: Joi.string().uuid().required(),
      is_required: Joi.boolean().optional(),
      display_order: Joi.number().integer().min(0).optional()
    })
  ).optional()
});

// Modifier Group Validators
export const createModifierGroupSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  selection_type: Joi.string().valid('single', 'multiple').optional(),
  min_selections: Joi.number().integer().min(0).optional(),
  max_selections: Joi.number().integer().min(1).optional().allow(null),
  is_required: Joi.boolean().optional(),
  display_order: Joi.number().integer().min(0).optional(),
  modifiers: Joi.array().items(
    Joi.object({
      modifier_id: Joi.string().uuid().required(),
      is_default: Joi.boolean().optional(),
      display_order: Joi.number().integer().min(0).optional()
    })
  ).optional()
});

export const updateModifierGroupSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  selection_type: Joi.string().valid('single', 'multiple').optional(),
  min_selections: Joi.number().integer().min(0).optional(),
  max_selections: Joi.number().integer().min(1).optional().allow(null),
  is_required: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
  display_order: Joi.number().integer().min(0).optional(),
  modifiers: Joi.array().items(
    Joi.object({
      modifier_id: Joi.string().uuid().required(),
      is_default: Joi.boolean().optional(),
      display_order: Joi.number().integer().min(0).optional()
    })
  ).optional()
});

// Menu Modifier Validators
export const createModifierSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  type: Joi.string().max(50).required(),
  price_adjustment: Joi.number().optional(),
  display_order: Joi.number().integer().min(0).optional()
});

export const updateModifierSchema = Joi.object({
  name: Joi.string().min(2).max(255).optional(),
  type: Joi.string().max(50).optional(),
  price_adjustment: Joi.number().optional(),
  is_active: Joi.boolean().optional(),
  display_order: Joi.number().integer().min(0).optional()
});
