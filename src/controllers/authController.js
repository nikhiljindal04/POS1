import authService from "../services/authService.js";
import { HTTP_STATUS } from "../utils/constants.js";
import logger from "../utils/logger.js";

class AuthController {
  async signUp(req, res, next) {
    try {
      const result = await authService.signUp(req.body);
      res.cookie("token", result.data.token, { httpOnly: true });

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async signIn(req, res, next) {
    try {
      const result = await authService.signIn(req.body);
      res.cookie("token", result.data.token, { httpOnly: true });

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Sign in successful",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async signOut(req, res, next) {
    try {
      // In a more sophisticated implementation, you might want to blacklist the token
      logger.info(`User signed out: ${req.user.username}`);

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Sign out successful",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
