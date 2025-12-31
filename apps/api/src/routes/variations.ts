import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = Router();

// Validation schemas
const createVariationSchema = z.object({
  colorName: z.string().min(1, 'Color name is required'),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  fabricId: z.string().uuid().optional(),
  isActive: z.boolean().default(true),
});

const updateVariationSchema = createVariationSchema.partial();

// GET /api/products/:productId/variations - Get all variations for a product
router.get('/products/:productId/variations', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const variations = await prisma.variation.findMany({
      where: { productId },
      include: {
        fabric: true,
        skus: true,
        _count: {
          select: {
            skus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json(variations);
  } catch (error) {
    throw error;
  }
});

// POST /api/products/:productId/variations - Create variation for a product
router.post('/products/:productId/variations', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const validatedData = createVariationSchema.parse(req.body);

    const variation = await prisma.variation.create({
      data: {
        ...validatedData,
        productId,
      },
      include: {
        fabric: true,
      },
    });

    res.status(201).json(variation);
  } catch (error) {
    throw error;
  }
});

// PUT /api/variations/:id - Update variation
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateVariationSchema.parse(req.body);

    const variation = await prisma.variation.update({
      where: { id },
      data: validatedData,
      include: {
        fabric: true,
      },
    });

    res.json(variation);
  } catch (error) {
    throw error;
  }
});

// DELETE /api/variations/:id - Soft delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const variation = await prisma.variation.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Variation deactivated', variation });
  } catch (error) {
    throw error;
  }
});

export default router;
