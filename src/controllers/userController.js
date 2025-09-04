import userService from '../services/userService.js';
import { HTTP_STATUS } from '../utils/constants.js';

class UserController {
  async getProfile(req, res, next) {
    try {
      const result = await userService.getUserProfile(req.user.userId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await userService.updateUserProfile(req.user.userId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Profile updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await userService.changePassword(req.user.userId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  // New methods for user management
  async createUser(req, res, next) {
    try {
      const result = await userService.createUser(req.user.userId, req.body);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'User created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await userService.getAllUsers(req.user.userId, filters);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const result = await userService.getUserById(req.user.userId, req.params.userId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const result = await userService.updateUser(req.user.userId, req.params.userId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'User updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const result = await userService.deleteUser(req.user.userId, req.params.userId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
