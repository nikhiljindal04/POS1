import prisma from '../config/database.js';

class Menu {
  // ==================== MENU CATEGORIES ====================
  
  static async findCategoriesByRestaurant(restaurantId, includeInactive = false) {
    const whereClause = { restaurant_id: restaurantId };
    if (!includeInactive) {
      whereClause.is_active = true;
    }

    return await prisma.menuCategory.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' },
      include: {
        menu_items: true,
        _count: {
          select: { menu_items: true }
        }
      }
    });
  }

  static async findCategoryById(categoryId, restaurantId) {
    return await prisma.menuCategory.findFirst({
      where: {
        category_id: categoryId,
        restaurant_id: restaurantId
      }
    });
  }

  // ==================== MENU ITEMS ====================

  static async findMenuItemsByRestaurant(restaurantId, filters = {}) {
    const whereClause = { restaurant_id: restaurantId };
    
    if (filters.category_id) whereClause.category_id = filters.category_id;
    if (filters.is_available !== undefined) whereClause.is_available = filters.is_available;
    if (filters.search) {
      whereClause.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ];
    }
    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = { hasSome: filters.tags };
    }

    return await prisma.menuItem.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' },
      include: {
        category: true,
        item_modifier_groups: {
          include: {
            modifier_group: {
              include: {
                modifier_group_items: {
                  include: {
                    menu_modifier: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async findMenuItemById(itemId, restaurantId) {
    return await prisma.menuItem.findFirst({
      where: {
        item_id: itemId,
        restaurant_id: restaurantId
      },
      include: {
        category: true,
        item_modifier_groups: {
          include: {
            modifier_group: {
              include: {
                modifier_group_items: {
                  include: {
                    menu_modifier: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  static async findMenuItemBySku(sku, restaurantId, excludeItemId = null) {
    const whereClause = {
      sku,
      restaurant_id: restaurantId
    };

    if (excludeItemId) {
      whereClause.item_id = { not: excludeItemId };
    }

    return await prisma.menuItem.findFirst({
      where: whereClause
    });
  }

  // ==================== MODIFIER GROUPS ====================

  static async findModifierGroupsByRestaurant(restaurantId, includeInactive = false) {
    const whereClause = { restaurant_id: restaurantId };
    if (!includeInactive) {
      whereClause.is_active = true;
    }

    return await prisma.modifierGroup.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' },
      include: {
        modifier_group_items: {
          include: {
            menu_modifier: true
          },
          orderBy: { display_order: 'asc' }
        }
      }
    });
  }

  static async findModifierGroupById(groupId, restaurantId) {
    return await prisma.modifierGroup.findFirst({
      where: {
        group_id: groupId,
        restaurant_id: restaurantId
      },
      include: {
        modifier_group_items: {
          include: {
            menu_modifier: true
          }
        }
      }
    });
  }

  // ==================== MENU MODIFIERS ====================

  static async findModifiersByRestaurant(restaurantId, includeInactive = false) {
    const whereClause = { restaurant_id: restaurantId };
    if (!includeInactive) {
      whereClause.is_active = true;
    }

    return await prisma.menuModifier.findMany({
      where: whereClause,
      orderBy: { display_order: 'asc' }
    });
  }

  static async findModifierById(modifierId, restaurantId) {
    return await prisma.menuModifier.findFirst({
      where: {
        modifier_id: modifierId,
        restaurant_id: restaurantId
      }
    });
  }

  // ==================== UTILITY METHODS ====================

  static async getFullMenuStructure(restaurantId) {
    return await prisma.menuCategory.findMany({
      where: {
        restaurant_id: restaurantId,
        is_active: true
      },
      orderBy: { display_order: 'asc' },
      include: {
        menu_items: {
          where: { is_available: true },
          orderBy: { display_order: 'asc' },
          include: {
            item_modifier_groups: {
              include: {
                modifier_group: {
                  include: {
                    modifier_group_items: {
                      include: {
                        menu_modifier: true
                      },
                      orderBy: { display_order: 'asc' }
                    }
                  }
                }
              },
              orderBy: { display_order: 'asc' }
            }
          }
        }
      }
    });
  }
}

export default Menu;
