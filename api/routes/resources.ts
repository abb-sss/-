import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all resources
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId, search, sort } = req.query;
    
    let where: any = {};
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    if (search) {
      where.title = { contains: String(search) };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'hot') {
      orderBy = { viewCount: 'desc' };
    } else if (sort === 'likes') {
      orderBy = { likeCount: 'desc' };
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy,
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        category: true,
      },
    });

    // Parse tags JSON for frontend
    const formattedResources = resources.map(r => ({
      ...r,
      tags: r.tags ? JSON.parse(r.tags) : []
    }));

    res.json({ success: true, data: formattedResources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch resources' });
  }
});

// Get single resource
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { id: true, username: true, avatarUrl: true } },
        category: true,
        comments: {
          include: {
            user: { select: { id: true, username: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
    });

    if (!resource) {
      res.status(404).json({ success: false, error: 'Resource not found' });
      return;
    }

    // Increment view count
    await prisma.resource.update({
      where: { id: Number(id) },
      data: { viewCount: { increment: 1 } }
    });

    const formattedResource = {
      ...resource,
      tags: resource.tags ? JSON.parse(resource.tags) : [],
      viewCount: resource.viewCount + 1
    };

    res.json({ success: true, data: formattedResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to fetch resource' });
  }
});

// Create resource
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, description, url, coverUrl, categoryId, tags, authorId } = req.body;
    
    // In a real app, authorId comes from JWT token
    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        url,
        coverUrl,
        categoryId: Number(categoryId),
        tags: JSON.stringify(tags || []),
        authorId: Number(authorId) || 1, // Mock authorId
      }
    });

    res.json({ success: true, data: newResource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to create resource' });
  }
});

// Like resource
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const resource = await prisma.resource.update({
      where: { id: Number(id) },
      data: { likeCount: { increment: 1 } }
    });

    res.json({ success: true, data: resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to like resource' });
  }
});

export default router;
