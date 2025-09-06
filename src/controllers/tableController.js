import tableService from '../services/tableService.js';
import { HTTP_STATUS } from '../utils/constants.js';
import logger from '../utils/logger.js';

class TableController {
  async createTable(req, res, next) {
    try {
      const result = await tableService.createTable(req.body, req.user.restaurantId);
      
      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Table created successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllTables(req, res, next) {
    try {
      const filters = {
        status: req.query.status,
        section: req.query.section,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await tableService.getAllTables(req.user.restaurantId, filters);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async getTableById(req, res, next) {
    try {
      const { tableId } = req.params;
      const result = await tableService.getTableById(tableId, req.user.restaurantId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTable(req, res, next) {
    try {
      const { tableId } = req.params;
      const result = await tableService.updateTable(tableId, req.user.restaurantId, req.body);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Table updated successfully',
        data: result.data
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTable(req, res, next) {
    try {
      const { tableId } = req.params;
      const result = await tableService.deleteTable(tableId, req.user.restaurantId);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTableStatus(req, res, next) {
    try {
      const { tableId } = req.params;
      const { status } = req.body;
      
      const result = await tableService.updateTableStatus(tableId, req.user.restaurantId, status);
      
      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new TableController();
