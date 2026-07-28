import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError, ConflictError } from '../utils/errors.js';

export class CategoryController {
  /**
   * Get all categories.
   */
  static async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await prisma.category.findMany({
        where: {
          slug: {
            notIn: ['shorts', 'videos', 'webstory', 'web-stories', 'podcasts'],
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
      return sendSuccess(res, categories, 'Categories list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new category.
   */
  static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, nameGu, nameHi, slug } = req.body;

      if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new BadRequestError('Category name is required.');
      }

      // Generate a slug if not provided
      let categorySlug = slug;
      if (!categorySlug || typeof categorySlug !== 'string' || categorySlug.trim() === '') {
        categorySlug = name
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      } else {
        categorySlug = categorySlug.trim().toLowerCase();
      }

      // Check if category with this slug already exists
      const existing = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (existing) {
        throw new ConflictError('A category with this slug already exists.');
      }

      const category = await prisma.category.create({
        data: {
          name: name.trim(),
          nameGu: nameGu ? nameGu.trim() : name.trim(),
          nameHi: nameHi ? nameHi.trim() : name.trim(),
          slug: categorySlug,
        },
      });

      return sendSuccess(res, category, 'Category created successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details of an existing category.
   */
  static async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, nameGu, nameHi, slug } = req.body;

      const category = await prisma.category.findUnique({
        where: { id },
      });
      if (!category) {
        throw new BadRequestError('Category not found.');
      }

      const updateData: any = {};
      if (name && typeof name === 'string') updateData.name = name.trim();
      if (nameGu && typeof nameGu === 'string') updateData.nameGu = nameGu.trim();
      if (nameHi && typeof nameHi === 'string') updateData.nameHi = nameHi.trim();

      if (slug && typeof slug === 'string') {
        const checkSlug = slug.trim().toLowerCase();
        // Check duplicate slug if changed
        if (checkSlug !== category.slug) {
          const duplicate = await prisma.category.findUnique({
            where: { slug: checkSlug },
          });
          if (duplicate) {
            throw new ConflictError('A category with this slug already exists.');
          }
        }
        updateData.slug = checkSlug;
      }

      const updated = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      return sendSuccess(res, updated, 'Category updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a category.
   */
  static async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // Restrict deletion if there are posts assigned to this category
      const postsCount = await prisma.post.count({
        where: { categoryId: id },
      });
      if (postsCount > 0) {
        throw new BadRequestError('Cannot delete category: posts are associated with it.');
      }

      await prisma.category.delete({
        where: { id },
      });

      return sendSuccess(res, null, 'Category deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
