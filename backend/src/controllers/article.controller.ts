import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError } from '../utils/errors.js';

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export class ArticleController {
  /**
   * Fetch all articles (posts) with filters.
   */
  static async getAllArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
      const skip = (page - 1) * limit;

      const query = req.query.query as string || '';
      const categorySlug = req.query.categorySlug as string || '';
      const status = req.query.status as string || '';

      const where: any = {};

      if (query) {
        const cleanQuery = query.replace(/^#/, '').trim();
        const numQuery = parseInt(cleanQuery, 10);
        where.OR = [
          { title: { contains: query } },
          { titleGu: { contains: query } },
          { titleHi: { contains: query } },
          { content: { contains: query } },
          { slug: { contains: query } },
          ...(!isNaN(numQuery) && numQuery > 0 ? [{ articleNumber: numQuery }] : []),
        ];
      }

      if (categorySlug) {
        where.category = {
          slug: categorySlug,
        };
      }

      if (status) {
        where.status = status;
      }

      const [articles, total] = await Promise.all([
        prisma.post.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            tags: true,
          },
          orderBy: [
            { updatedAt: 'desc' },
            { createdAt: 'desc' },
          ],
          skip,
          take: limit,
        }),
        prisma.post.count({ where }),
      ]);

      const totalPages = Math.ceil(total / limit);

      return sendSuccess(res, {
        articles,
        total,
        totalPages,
      }, 'Articles list retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Fetch details of a single article.
   */
  static async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const article = await prisma.post.findUnique({
        where: { id },
        include: {
          category: true,
          author: true,
          tags: true,
        },
      });

      if (!article) {
        throw new BadRequestError('Article not found.');
      }

      return sendSuccess(res, { article }, 'Article retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new article.
   */
  static async createArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        titleGu,
        titleHi,
        excerpt,
        excerptGu,
        excerptHi,
        content,
        contentGu,
        contentHi,
        featuredImage,
        status,
        categoryId,
        authorId,
        priority,
        readingTime,
        isTrending,
        isBreaking,
        isFeatured,
        articleNumber,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        metaRobots,
        tags, // array of { name: string }
        slug,
      } = req.body;

      if (!title || !content || !categoryId || !authorId) {
        throw new BadRequestError('Title, content, categoryId, and authorId are required.');
      }

      let assignedArticleNum: number;
      if (articleNumber !== undefined && articleNumber !== null) {
        const num = parseInt(articleNumber, 10);
        if (isNaN(num) || num <= 0) {
          throw new BadRequestError('Invalid article number.');
        }
        const dup = await prisma.post.findFirst({ where: { articleNumber: num } });
        if (dup) {
          throw new BadRequestError(`Article number ${num} is already taken.`);
        }
        assignedArticleNum = num;
      } else {
        const maxArticle = await prisma.post.findFirst({
          orderBy: { articleNumber: 'desc' },
          select: { articleNumber: true },
        });
        assignedArticleNum = (maxArticle?.articleNumber ?? 0) + 1;
      }

      let postSlug = slug;
      if (!postSlug || typeof postSlug !== 'string' || postSlug.trim() === '') {
        postSlug = slugify(title);
      } else {
        postSlug = slugify(postSlug);
      }

      // Check unique slug
      const existing = await prisma.post.findUnique({
        where: { slug: postSlug },
      });
      if (existing) {
        postSlug = `${postSlug}-${Math.random().toString(36).substring(2, 7)}`;
      }

      const tagConnectOrCreate = Array.isArray(tags) ? tags.map((t: any) => {
        const name = t.name.trim();
        const tagSlug = slugify(name);
        return {
          where: { slug: tagSlug },
          create: {
            slug: tagSlug,
            name,
            nameGu: name,
            nameHi: name,
          },
        };
      }) : [];

      const post = await prisma.post.create({
        data: {
          slug: postSlug,
          articleNumber: assignedArticleNum,
          title: title.trim(),
          titleGu: (titleGu || title).trim(),
          titleHi: (titleHi || title).trim(),
          excerpt: (excerpt || '').trim(),
          excerptGu: (excerptGu || excerpt || '').trim(),
          excerptHi: (excerptHi || excerpt || '').trim(),
          content: content.trim(),
          contentGu: (contentGu || content).trim(),
          contentHi: (contentHi || content).trim(),
          featuredImage: (featuredImage || '').trim(),
          status: status || 'DRAFT',
          authorId,
          categoryId,
          priority: priority ? Number(priority) : 0,
          readingTime: readingTime ? Number(readingTime) : 0,
          isTrending: !!isTrending,
          isBreaking: !!isBreaking,
          isFeatured: !!isFeatured,
          seoTitle: (seoTitle || '').trim(),
          seoDescription: (seoDescription || '').trim(),
          seoKeywords: (seoKeywords || '').trim(),
          canonicalUrl: (canonicalUrl || '').trim(),
          metaRobots: (metaRobots || '').trim(),
          tags: {
            connectOrCreate: tagConnectOrCreate,
          },
        },
        include: {
          category: true,
          author: true,
          tags: true,
        },
      });

      return sendSuccess(res, { article: post }, 'Article created successfully.', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update details of an existing article.
   */
  static async updateArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const {
        title,
        titleGu,
        titleHi,
        excerpt,
        excerptGu,
        excerptHi,
        content,
        contentGu,
        contentHi,
        featuredImage,
        status,
        categoryId,
        authorId,
        priority,
        readingTime,
        isTrending,
        isBreaking,
        isFeatured,
        articleNumber,
        seoTitle,
        seoDescription,
        seoKeywords,
        canonicalUrl,
        metaRobots,
        tags, // array of { name: string }
        slug,
      } = req.body;

      const existingPost = await prisma.post.findUnique({
        where: { id },
      });
      if (!existingPost) {
        throw new BadRequestError('Article not found.');
      }

      const updateData: any = {};

      if (title !== undefined) updateData.title = title.trim();
      if (titleGu !== undefined) updateData.titleGu = titleGu.trim();
      if (titleHi !== undefined) updateData.titleHi = titleHi.trim();
      if (excerpt !== undefined) updateData.excerpt = excerpt.trim();
      if (excerptGu !== undefined) updateData.excerptGu = excerptGu.trim();
      if (excerptHi !== undefined) updateData.excerptHi = excerptHi.trim();
      if (content !== undefined) updateData.content = content.trim();
      if (contentGu !== undefined) updateData.contentGu = contentGu.trim();
      if (contentHi !== undefined) updateData.contentHi = contentHi.trim();
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage.trim();
      if (status !== undefined) updateData.status = status;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (authorId !== undefined) updateData.authorId = authorId;
      if (priority !== undefined) updateData.priority = Number(priority);
      if (readingTime !== undefined) updateData.readingTime = Number(readingTime);
      if (isTrending !== undefined) updateData.isTrending = !!isTrending;
      if (isBreaking !== undefined) updateData.isBreaking = !!isBreaking;
      if (isFeatured !== undefined) updateData.isFeatured = !!isFeatured;
      if (articleNumber !== undefined) {
        const num = parseInt(articleNumber, 10);
        if (!isNaN(num) && num > 0) {
          // Check if the number is already taken by another article
          const duplicate = await prisma.post.findFirst({
            where: { articleNumber: num, NOT: { id } },
          });
          if (!duplicate) {
            updateData.articleNumber = num;
          } else {
            throw new BadRequestError(`Article number ${num} is already used by another article.`);
          }
        }
      }
      if (seoTitle !== undefined) updateData.seoTitle = seoTitle.trim();
      if (seoDescription !== undefined) updateData.seoDescription = seoDescription.trim();
      if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords.trim();
      if (canonicalUrl !== undefined) updateData.canonicalUrl = canonicalUrl.trim();
      if (metaRobots !== undefined) updateData.metaRobots = metaRobots.trim();

      if (slug !== undefined) {
        let postSlug = slugify(slug);
        if (postSlug !== existingPost.slug) {
          const duplicate = await prisma.post.findUnique({
            where: { slug: postSlug },
          });
          if (duplicate) {
            postSlug = `${postSlug}-${Math.random().toString(36).substring(2, 7)}`;
          }
        }
        updateData.slug = postSlug;
      }

      if (tags !== undefined && Array.isArray(tags)) {
        updateData.tags = {
          set: [],
          connectOrCreate: tags.map((t: any) => {
            const name = t.name.trim();
            const tagSlug = slugify(name);
            return {
              where: { slug: tagSlug },
              create: {
                slug: tagSlug,
                name,
                nameGu: name,
                nameHi: name,
              },
            };
          }),
        };
      }

      const updated = await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          author: true,
          tags: true,
        },
      });

      return sendSuccess(res, { article: updated }, 'Article updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete an article.
   */
  static async deleteArticle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const article = await prisma.post.findUnique({ where: { id } });
      if (!article) {
        throw new BadRequestError('Article not found.');
      }

      await prisma.post.delete({
        where: { id },
      });

      return sendSuccess(res, null, 'Article deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}
