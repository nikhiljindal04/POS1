import prisma from '../config/database.js';

class User {
  static async findById(userId) {
    return await prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        restaurant: true
      }
    });
  }

  static async findByUsername(username) {
    return await prisma.user.findUnique({
      where: { username },
      include: {
        restaurant: true
      }
    });
  }

  static async findByEmail(email) {
    return await prisma.user.findFirst({
      where: { email },
      include: {
        restaurant: true
      }
    });
  }

  static async create(userData) {
    return await prisma.user.create({
      data: userData,
      include: {
        restaurant: true
      }
    });
  }

  static async update(userId, updateData) {
    return await prisma.user.update({
      where: { user_id: userId },
      data: updateData,
      include: {
        restaurant: true
      }
    });
  }

  static async delete(userId) {
    return await prisma.user.update({
      where: { user_id: userId },
      data: { is_active: false }
    });
  }

  static async findByRestaurant(restaurantId) {
    return await prisma.user.findMany({
      where: { 
        restaurant_id: restaurantId,
        is_active: true 
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        role: true,
        created_at: true
      }
    });
  }
}

export default User;
