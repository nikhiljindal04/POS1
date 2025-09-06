import prisma from '../config/database.js';
import logger from '../utils/logger.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class TableService {
  async createTable(tableData, restaurantId) {
    try {
      const { table_number, capacity, section, status = 'available', qr_code_url } = tableData;

      // Check if table number already exists in this restaurant
      const existingTable = await prisma.table.findFirst({
        where: {
          restaurant_id: restaurantId,
          table_number
        }
      });

      if (existingTable) {
        throw new Error(`Table number ${table_number} already exists in this restaurant`);
      }

      const newTable = await prisma.table.create({
        data: {
          restaurant_id: restaurantId,
          table_number,
          capacity,
          section,
          status,
          qr_code_url,
          created_at: new Date(),
          updated_at: new Date()
        },
        include: {
          restaurant: {
            select: {
              name: true
            }
          }
        }
      });

      logger.info(`Table created: ${table_number} for restaurant: ${restaurantId}`);

      return {
        success: true,
        data: newTable
      };
    } catch (error) {
      logger.error('Create table failed:', error);
      throw error;
    }
  }

  async getAllTables(restaurantId, filters = {}) {
    try {
      const { status, section, page = 1, limit = 50 } = filters;
      const offset = (page - 1) * limit;

      const whereClause = {
        restaurant_id: restaurantId,
        ...(status && { status }),
        ...(section && { section })
      };

      const [tables, totalCount] = await Promise.all([
        prisma.table.findMany({
          where: whereClause,
          orderBy: [
            { section: 'asc' },
            { table_number: 'asc' }
          ],
          skip: offset,
          take: parseInt(limit),
          include: {
            _count: {
              select: {
                table_reservations: {
                  where: {
                    status: 'confirmed',
                    reservation_time: {
                      gte: new Date()
                    }
                  }
                },
                orders: {
                  where: {
                    status: {
                      in: ['pending', 'confirmed', 'preparing']
                    }
                  }
                }
              }
            }
          }
        }),
        prisma.table.count({ where: whereClause })
      ]);

      return {
        success: true,
        data: {
          tables,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit)
          }
        }
      };
    } catch (error) {
      logger.error('Get tables failed:', error);
      throw error;
    }
  }

  async getTableById(tableId, restaurantId) {
    try {
      const table = await prisma.table.findFirst({
        where: {
          table_id: tableId,
          restaurant_id: restaurantId
        },
        include: {
          restaurant: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              table_reservations: {
                where: {
                  status: 'confirmed',
                  reservation_time: {
                    gte: new Date()
                  }
                }
              },
              orders: {
                where: {
                  status: {
                    in: ['pending', 'confirmed', 'preparing']
                  }
                }
              }
            }
          }
        }
      });

      if (!table) {
        throw new Error('Table not found');
      }

      return {
        success: true,
        data: table
      };
    } catch (error) {
      logger.error('Get table by ID failed:', error);
      throw error;
    }
  }

  async updateTable(tableId, restaurantId, updateData) {
    try {
      const { table_number, capacity, section, status, qr_code_url } = updateData;

      // Check if table exists
      const existingTable = await prisma.table.findFirst({
        where: {
          table_id: tableId,
          restaurant_id: restaurantId
        }
      });

      if (!existingTable) {
        throw new Error('Table not found');
      }

      // If updating table number, check for conflicts
      if (table_number && table_number !== existingTable.table_number) {
        const conflictingTable = await prisma.table.findFirst({
          where: {
            restaurant_id: restaurantId,
            table_number,
            table_id: {
              not: tableId
            }
          }
        });

        if (conflictingTable) {
          throw new Error(`Table number ${table_number} already exists in this restaurant`);
        }
      }

      const updatedTable = await prisma.table.update({
        where: { table_id: tableId },
        data: {
          ...(table_number && { table_number }),
          ...(capacity && { capacity }),
          ...(section !== undefined && { section }),
          ...(status && { status }),
          ...(qr_code_url !== undefined && { qr_code_url }),
          updated_at: new Date()
        },
        include: {
          restaurant: {
            select: {
              name: true
            }
          }
        }
      });

      logger.info(`Table updated: ${tableId} in restaurant: ${restaurantId}`);

      return {
        success: true,
        data: updatedTable
      };
    } catch (error) {
      logger.error('Update table failed:', error);
      throw error;
    }
  }

  async deleteTable(tableId, restaurantId) {
    try {
      // Check if table exists
      const existingTable = await prisma.table.findFirst({
        where: {
          table_id: tableId,
          restaurant_id: restaurantId
        },
        include: {
          _count: {
            select: {
              table_reservations: {
                where: {
                  status: 'confirmed',
                  reservation_time: {
                    gte: new Date()
                  }
                }
              },
              orders: {
                where: {
                  status: {
                    in: ['pending', 'confirmed', 'preparing']
                  }
                }
              }
            }
          }
        }
      });

      if (!existingTable) {
        throw new Error('Table not found');
      }

      // Check if table has status 'available'
      if (existingTable.status !== 'available') {
        throw new Error('Cannot delete table with status other than available');
      }

      // Check if table has active reservations or orders
      if (existingTable._count.table_reservations > 0) {
        throw new Error('Cannot delete table with active reservations');
      }

      if (existingTable._count.orders > 0) {
        throw new Error('Cannot delete table with active orders');
      }

      await prisma.table.delete({
        where: { table_id: tableId }
      });

      logger.info(`Table deleted: ${tableId} from restaurant: ${restaurantId}`);

      return {
        success: true,
        message: 'Table deleted successfully'
      };
    } catch (error) {
      logger.error('Delete table failed:', error);
      throw error;
    }
  }

  async updateTableStatus(tableId, restaurantId, status) {
    try {
      const validStatuses = ['available', 'occupied', 'reserved', 'maintenance'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const updatedTable = await prisma.table.updateMany({
        where: {
          table_id: tableId,
          restaurant_id: restaurantId
        },
        data: {
          status,
          updated_at: new Date()
        }
      });

      if (updatedTable.count === 0) {
        throw new Error('Table not found');
      }

      logger.info(`Table status updated: ${tableId} to ${status}`);

      return {
        success: true,
        message: 'Table status updated successfully'
      };
    } catch (error) {
      logger.error('Update table status failed:', error);
      throw error;
    }
  }
}

export default new TableService();
