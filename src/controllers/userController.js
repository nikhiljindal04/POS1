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
}

export default new UserController();
