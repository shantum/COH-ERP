import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = Router();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['DRESS', 'TOP', 'BOTTOM', 'OUTERWEAR', 'ACCESSORY']),
  productType: z.enum(['BASIC', 'SEASONAL', 'LIMITED']),
  baseProductionTimeMins: z.number().int().positive().default(45),
  isActive: z.boolean().default(true),
});

const updateProductSchema = createProductSchema.partial();

// GET /api/products - List all products with counts
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: {
            variations: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get SKU counts for each product
    const productsWithCounts = await Promise.all(
      products.map(async (product) => {
        const skuCount = await prisma.sku.count({
          where: {
            variation: {
              productId: product.id,
            },
          },
        });

        return {
          ...product,
          variationCount: product._count.variations,
          skuCount,
        };
      })
    );

    res.json(productsWithCounts);
  } catch (error) {
    throw error;
  }
});

// GET /api/products/:id - Get single product with all variations and SKUs
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        variations: {
          include: {
            skus: {
              orderBy: {
                size: 'asc',
              },
            },
            fabric: {
              include: {
                fabricType: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    throw error;
  }
});

// POST /api/products - Create new product
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: validatedData,
    });

    res.status(201).json(product);
  } catch (error) {
    throw error;
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);

    const product = await prisma.product.update({
      where: { id },
      data: validatedData,
    });

    res.json(product);
  } catch (error) {
    throw error;
  }
});

// DELETE /api/products/:id - Soft delete (set isActive = false)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Product deactivated', product });
  } catch (error) {
    throw error;
  }
});

export default router;
