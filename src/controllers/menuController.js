import menuService from '../services/menuService.js';
import { HTTP_STATUS } from '../utils/constants.js';

class MenuController {
  // ==================== MENU CATEGORIES ====================

  async createCategory(req, res, next) {
    try {
      const result = await menuService.createCategory(req.user.restaurantId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Category created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req, res, next) {
    try {
      const includeInactive = req.query.include_inactive === 'true';
      const result = await menuService.getCategories(req.user.restaurantId, includeInactive);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const result = await menuService.updateCategory(req.user.restaurantId, categoryId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Category updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { categoryId } = req.params;
      const result = await menuService.deleteCategory(req.user.restaurantId, categoryId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== MENU ITEMS ====================

  async createMenuItem(req, res, next) {
    try {
      const result = await menuService.createMenuItem(req.user.restaurantId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Menu item created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenuItems(req, res, next) {
    try {
      const filters = {
        category_id: req.query.category_id,
        is_available: req.query.is_available ? req.query.is_available === 'true' : undefined,
        search: req.query.search,
        tags: req.query.tags ? req.query.tags.split(',') : undefined
      };
      
      const result = await menuService.getMenuItems(req.user.restaurantId, filters);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getMenuItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const result = await menuService.getMenuItem(req.user.restaurantId, itemId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMenuItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const result = await menuService.updateMenuItem(req.user.restaurantId, itemId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Menu item updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMenuItem(req, res, next) {
    try {
      const { itemId } = req.params;
      const result = await menuService.deleteMenuItem(req.user.restaurantId, itemId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== MODIFIER GROUPS ====================

  async createModifierGroup(req, res, next) {
    try {
      const result = await menuService.createModifierGroup(req.user.restaurantId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Modifier group created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getModifierGroups(req, res, next) {
    try {
      const includeInactive = req.query.include_inactive === 'true';
      const result = await menuService.getModifierGroups(req.user.restaurantId, includeInactive);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateModifierGroup(req, res, next) {
    try {
      const { groupId } = req.params;
      const result = await menuService.updateModifierGroup(req.user.restaurantId, groupId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Modifier group updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteModifierGroup(req, res, next) {
    try {
      const { groupId } = req.params;
      const result = await menuService.deleteModifierGroup(req.user.restaurantId, groupId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== MENU MODIFIERS ====================

  async createModifier(req, res, next) {
    try {
      const result = await menuService.createModifier(req.user.restaurantId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Modifier created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getModifiers(req, res, next) {
    try {
      const includeInactive = req.query.include_inactive === 'true';
      const result = await menuService.getModifiers(req.user.restaurantId, includeInactive);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateModifier(req, res, next) {
    try {
      const { modifierId } = req.params;
      const result = await menuService.updateModifier(req.user.restaurantId, modifierId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Modifier updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteModifier(req, res, next) {
    try {
      const { modifierId } = req.params;
      const result = await menuService.deleteModifier(req.user.restaurantId, modifierId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // ==================== BULK OPERATIONS ====================

  async getFullMenu(req, res, next) {
    try {
      const result = await menuService.getFullMenu(req.user.restaurantId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MenuController();
