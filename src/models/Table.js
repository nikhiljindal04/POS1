import prisma from '../config/database.js';

class Table {
  static async findById(tableId) {
    return await prisma.table.findUnique({
      where: { table_id: tableId },
      include: {
        restaurant: true,
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
    });
  }

  static async findByRestaurant(restaurantId, filters = {}) {
    const { status, section } = filters;
    
    return await prisma.table.findMany({
      where: {
        restaurant_id: restaurantId,
        ...(status && { status }),
        ...(section && { section })
      },
      orderBy: [
        { section: 'asc' },
        { table_number: 'asc' }
      ]
    });
  }

  static async findByTableNumber(restaurantId, tableNumber) {
    return await prisma.table.findFirst({
      where: {
        restaurant_id: restaurantId,
        table_number: tableNumber
      }
    });
  }

  static async create(tableData) {
    return await prisma.table.create({
      data: tableData,
      include: {
        restaurant: true
      }
    });
  }

  static async update(tableId, updateData) {
    return await prisma.table.update({
      where: { table_id: tableId },
      data: updateData,
      include: {
        restaurant: true
      }
    });
  }

  static async delete(tableId) {
    return await prisma.table.delete({
      where: { table_id: tableId }
    });
  }

  static async updateStatus(tableId, status) {
    return await prisma.table.update({
      where: { table_id: tableId },
      data: {
        status,
        updated_at: new Date()
      }
    });
  }

  static async getTableStats(restaurantId) {
    const stats = await prisma.table.groupBy({
      by: ['status'],
      where: {
        restaurant_id: restaurantId
      },
      _count: {
        table_id: true
      }
    });

    return stats.reduce((acc, stat) => {
      acc[stat.status] = stat._count.table_id;
      return acc;
    }, {});
  }
}

export default Table;
