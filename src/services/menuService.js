import prisma from '../config/database.js';
import logger from '../utils/logger.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

class MenuService {
  // ==================== MENU CATEGORIES ====================
  
  async createCategory(restaurantId, categoryData) {
    try {
      const { name, display_order } = categoryData;

      // Check if category already exists
      const existingCategory = await prisma.menuCategory.findFirst({
        where: { name, restaurant_id: restaurantId }
      });
      if (existingCategory) {
        throw new Error("ERROR_MESSAGES.MENU_CATEGORY_ALREADY_EXISTS");
      }

      const category = await prisma.menuCategory.create({
        data: {
          restaurant_id: restaurantId,
          name,
          display_order: display_order || 0,
          is_active: true
        }
      });

      logger.info(`Menu category created: ${name} for restaurant: ${restaurantId}`);
      return { success: true, data: category };
    } catch (error) {
      logger.error('Create category failed:', error);
      throw error;
    }
  }

  async getCategories(restaurantId, includeInactive = false) {
    try {
      const whereClause = { restaurant_id: restaurantId };
      if (!includeInactive) {
        whereClause.is_active = true;
      }

      const categories = await prisma.menuCategory.findMany({
        where: whereClause,
        orderBy: { display_order: 'asc' },
        include: {
          menu_items: {
            where: includeInactive ? {} : { is_available: true },
            orderBy: { display_order: 'asc' }
          },
          _count: {
            select: { menu_items: true }
          }
        }
      });

      return { success: true, data: categories };
    } catch (error) {
      logger.error('Get categories failed:', error);
      throw error;
    }
  }

  async updateCategory(restaurantId, categoryId, updateData) {
    try {
      const { name, display_order, is_active } = updateData;

      const category = await prisma.menuCategory.update({
        where: {
          category_id: categoryId,
          restaurant_id: restaurantId
        },
        data: {
          ...(name && { name }),
          ...(display_order !== undefined && { display_order }),
          ...(is_active !== undefined && { is_active }),
          updated_at: new Date()
        }
      });

      logger.info(`Menu category updated: ${categoryId}`);
      return { success: true, data: category };
    } catch (error) {
      logger.error('Update category failed:', error);
      throw error;
    }
  }

  async deleteCategory(restaurantId, categoryId) {
    try {
      // Check if category has menu items
      const itemCount = await prisma.menuItem.count({
        where: {
          category_id: categoryId,
          restaurant_id: restaurantId
        }
      });

      if (itemCount > 0) {
        throw new Error('Cannot delete category with existing menu items');
      }

      await prisma.menuCategory.delete({
        where: {
          category_id: categoryId,
          restaurant_id: restaurantId
        }
      });

      logger.info(`Menu category deleted: ${categoryId}`);
      return { success: true, message: 'Category deleted successfully' };
    } catch (error) {
      logger.error('Delete category failed:', error);
      throw error;
    }
  }

  // ==================== MENU ITEMS ====================

  async createMenuItem(restaurantId, itemData) {
    try {
      const {
        category_id,
        name,
        description,
        price,
        cost,
        preparation_time,
        ingredients = [],
        allergens = [],
        image_url,
        is_vegetarian = false,
        is_vegan = false,
        is_gluten_free = false,
        spice_level,
        calories,
        nutritional_info,
        tags = [],
        sku,
        display_order,
        modifier_groups = []
      } = itemData;

      // Check if menu item already exists
      const existingItem = await prisma.menuItem.findFirst({
        where: {
          name,
          restaurant_id: restaurantId
        }
      });

      if (existingItem) {
        throw new Error('Menu item already exists');
      }

      const result = await prisma.$transaction(async (tx) => {
        // Create menu item
        const menuItem = await tx.menuItem.create({
          data: {
            restaurant_id: restaurantId,
            category_id: category_id || null,
            name,
            description,
            price,
            cost,
            preparation_time,
            ingredients,
            allergens,
            image_url,
            is_vegetarian,
            is_vegan,
            is_gluten_free,
            spice_level,
            calories,
            nutritional_info,
            tags,
            sku,
            display_order: display_order || 0,
            is_available: true
          }
        });

        // Associate modifier groups if provided
        if (modifier_groups && modifier_groups.length > 0) {
          await tx.itemModifierGroup.createMany({
            data: modifier_groups.map((group, index) => ({
              item_id: menuItem.item_id,
              group_id: group.group_id,
              is_required: group.is_required || false,
              display_order: group.display_order || index
            }))
          });
        }

        return menuItem;
      });

      logger.info(`Menu item created: ${name} for restaurant: ${restaurantId}`);
      return { success: true, data: result };
    } catch (error) {
      logger.error('Create menu item failed:', error);
      throw error;
    }
  }

  async getMenuItems(restaurantId, filters = {}) {
    try {
      const { category_id, is_available, search, tags } = filters;
      
      const whereClause = { restaurant_id: restaurantId };
      
      if (category_id) whereClause.category_id = category_id;
      if (is_available !== undefined) whereClause.is_available = is_available;
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }
      if (tags && tags.length > 0) {
        whereClause.tags = { hasSome: tags };
      }

      const menuItems = await prisma.menuItem.findMany({
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
            },
            orderBy: { display_order: 'asc' }
          }
        }
      });

      return { success: true, data: menuItems };
    } catch (error) {
      logger.error('Get menu items failed:', error);
      throw error;
    }
  }

  async getMenuItem(restaurantId, itemId) {
    try {
      const menuItem = await prisma.menuItem.findFirst({
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
                    },
                    orderBy: { display_order: 'asc' }
                  }
                }
              }
            },
            orderBy: { display_order: 'asc' }
          }
        }
      });

      if (!menuItem) {
        throw new Error('Menu item not found');
      }

      return { success: true, data: menuItem };
    } catch (error) {
      logger.error('Get menu item failed:', error);
      throw error;
    }
  }

  async updateMenuItem(restaurantId, itemId, updateData) {
    try {
      const { modifier_groups, ...itemUpdateData } = updateData;

      const result = await prisma.$transaction(async (tx) => {
        // Update menu item
        const menuItem = await tx.menuItem.update({
          where: {
            item_id: itemId,
            restaurant_id: restaurantId
          },
          data: {
            ...itemUpdateData,
            updated_at: new Date()
          }
        });

        // Update modifier groups if provided
        if (modifier_groups !== undefined) {
          // Remove existing association
          await tx.itemModifierGroup.deleteMany({
            where: { item_id: itemId }
          });

          // Add new associations
          if (modifier_groups.length > 0) {
            await tx.itemModifierGroup.createMany({
              data: modifier_groups.map((group, index) => ({
                item_id: itemId,
                group_id: group.group_id,
                is_required: group.is_required || false,
                display_order: group.display_order || index
              }))
            });
          }
        }

        return menuItem;
      });

      logger.info(`Menu item updated: ${itemId}`);
      return { success: true, data: result };
    } catch (error) {
      logger.error('Update menu item failed:', error);
      throw error;
    }
  }

  async deleteMenuItem(restaurantId, itemId) {
    try {
      await prisma.$transaction(async (tx) => {
        // Remove modifier group associations
        await tx.itemModifierGroup.deleteMany({
          where: { item_id: itemId }
        });

        // Delete menu item
        await tx.menuItem.delete({
          where: {
            item_id: itemId,
            restaurant_id: restaurantId
          }
        });
      });

      logger.info(`Menu item deleted: ${itemId}`);
      return { success: true, message: 'Menu item deleted successfully' };
    } catch (error) {
      logger.error('Delete menu item failed:', error);
      throw error;
    }
  }

  // ==================== MODIFIER GROUPS ====================

  async createModifierGroup(restaurantId, groupData) {
    try {
      const {
        name,
        selection_type = 'single',
        min_selections = 0,
        max_selections,
        is_required = false,
        display_order = 0,
        modifiers = []
      } = groupData;

      const result = await prisma.$transaction(async (tx) => {
        // Create modifier group
        const modifierGroup = await tx.modifierGroup.create({
          data: {
            restaurant_id: restaurantId,
            name,
            selection_type,
            min_selections,
            max_selections,
            is_required,
            display_order,
            is_active: true
          }
        });

        // Associate modifiers if provided
        if (modifiers && modifiers.length > 0) {
          await tx.modifierGroupItem.createMany({
            data: modifiers.map((modifier, index) => ({
              group_id: modifierGroup.group_id,
              modifier_id: modifier.modifier_id,
              is_default: modifier.is_default || false,
              display_order: modifier.display_order || index
            }))
          });
        }

        return modifierGroup;
      });

      logger.info(`Modifier group created: ${name} for restaurant: ${restaurantId}`);
      return { success: true, data: result };
    } catch (error) {
      logger.error('Create modifier group failed:', error);
      throw error;
    }
  }

  async getModifierGroups(restaurantId, includeInactive = false) {
    try {
      const whereClause = { restaurant_id: restaurantId };
      if (!includeInactive) {
        whereClause.is_active = true;
      }

      const modifierGroups = await prisma.modifierGroup.findMany({
        where: whereClause,
        orderBy: { display_order: 'asc' },
        include: {
          modifier_group_items: {
            include: {
              menu_modifier: true
            },
            orderBy: { display_order: 'asc' }
          },
          _count: {
            select: { modifier_group_items: true }
          }
        }
      });

      return { success: true, data: modifierGroups };
    } catch (error) {
      logger.error('Get modifier groups failed:', error);
      throw error;
    }
  }

  async updateModifierGroup(restaurantId, groupId, updateData) {
    try {
      const { modifiers, ...groupUpdateData } = updateData;

      const result = await prisma.$transaction(async (tx) => {
        // Update modifier group
        const modifierGroup = await tx.modifierGroup.update({
          where: {
            group_id: groupId,
            restaurant_id: restaurantId
          },
          data: groupUpdateData
        });

        // Update modifiers if provided
        if (modifiers !== undefined) {
          // Remove existing associations
          await tx.modifierGroupItem.deleteMany({
            where: { group_id: groupId }
          });

          // Add new associations
          if (modifiers.length > 0) {
            await tx.modifierGroupItem.createMany({
              data: modifiers.map((modifier, index) => ({
                group_id: groupId,
                modifier_id: modifier.modifier_id,
                is_default: modifier.is_default || false,
                display_order: modifier.display_order || index
              }))
            });
          }
        }

        return modifierGroup;
      });

      logger.info(`Modifier group updated: ${groupId}`);
      return { success: true, data: result };
    } catch (error) {
      logger.error('Update modifier group failed:', error);
      throw error;
    }
  }

  async deleteModifierGroup(restaurantId, groupId) {
    try {
      await prisma.$transaction(async (tx) => {
        // Remove modifier associations
        await tx.modifierGroupItem.deleteMany({
          where: { group_id: groupId }
        });

        // Remove item associations
        await tx.itemModifierGroup.deleteMany({
          where: { group_id: groupId }
        });

        // Delete modifier group
        await tx.modifierGroup.delete({
          where: {
            group_id: groupId,
            restaurant_id: restaurantId
          }
        });
      });

      logger.info(`Modifier group deleted: ${groupId}`);
      return { success: true, message: 'Modifier group deleted successfully' };
    } catch (error) {
      logger.error('Delete modifier group failed:', error);
      throw error;
    }
  }

  // ==================== MENU MODIFIERS ====================

  async createModifier(restaurantId, modifierData) {
    try {
      const {
        name,
        type,
        price_adjustment = 0,
        display_order = 0
      } = modifierData;

      const modifier = await prisma.menuModifier.create({
        data: {
          restaurant_id: restaurantId,
          name,
          type,
          price_adjustment,
          display_order,
          is_active: true
        }
      });

      logger.info(`Menu modifier created: ${name} for restaurant: ${restaurantId}`);
      return { success: true, data: modifier };
    } catch (error) {
      logger.error('Create modifier failed:', error);
      throw error;
    }
  }

  async getModifiers(restaurantId, includeInactive = false) {
    try {
      const whereClause = { restaurant_id: restaurantId };
      if (!includeInactive) {
        whereClause.is_active = true;
      }

      const modifiers = await prisma.menuModifier.findMany({
        where: whereClause,
        orderBy: { display_order: 'asc' }
      });

      return { success: true, data: modifiers };
    } catch (error) {
      logger.error('Get modifiers failed:', error);
      throw error;
    }
  }

  async updateModifier(restaurantId, modifierId, updateData) {
    try {
      const modifier = await prisma.menuModifier.update({
        where: {
          modifier_id: modifierId,
          restaurant_id: restaurantId
        },
        data: {
          ...updateData,
          updated_at: new Date()
        }
      });

      logger.info(`Menu modifier updated: ${modifierId}`);
      return { success: true, data: modifier };
    } catch (error) {
      logger.error('Update modifier failed:', error);
      throw error;
    }
  }

  async deleteModifier(restaurantId, modifierId) {
    try {
      await prisma.$transaction(async (tx) => {
        // Remove from modifier groups
        await tx.modifierGroupItem.deleteMany({
          where: { modifier_id: modifierId }
        });

        // Delete modifier
        await tx.menuModifier.delete({
          where: {
            modifier_id: modifierId,
            restaurant_id: restaurantId
          }
        });
      });

      logger.info(`Menu modifier deleted: ${modifierId}`);
      return { success: true, message: 'Modifier deleted successfully' };
    } catch (error) {
      logger.error('Delete modifier failed:', error);
      throw error;
    }
  }

  // ==================== BULK OPERATIONS ====================

  async getFullMenu(restaurantId) {
    try {
      const categories = await prisma.menuCategory.findMany({
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

      return { success: true, data: categories };
    } catch (error) {
      logger.error('Get full menu failed:', error);
      throw error;
    }
  }
}

export default new MenuService();
