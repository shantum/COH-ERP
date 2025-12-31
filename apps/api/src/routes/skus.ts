import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = Router();

// Validation schemas
const createSkuSchema = z.object({
  skuCode: z.string().min(1, 'SKU code is required'),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE']),
  fabricConsumption: z.number().positive('Fabric consumption must be positive'),
  mrp: z.number().positive('MRP must be positive'),
  targetStockQty: z.number().int().nonnegative().default(10),
  targetStockMethod: z.enum(['SEVEN_DAY', 'FOURTEEN_DAY', 'TWENTY_EIGHT_DAY', 'MANUAL']).default('FOURTEEN_DAY'),
  isActive: z.boolean().default(true),
});

const updateSkuSchema = createSkuSchema.partial();

// GET /api/variations/:variationId/skus - Get all SKUs for a variation
router.get('/variations/:variationId/skus', async (req: Request, res: Response) => {
  try {
    const { variationId } = req.params;

    const skus = await prisma.sku.findMany({
      where: { variationId },
      orderBy: {
        size: 'asc',
      },
    });

    res.json(skus);
  } catch (error) {
    throw error;
  }
});

// POST /api/variations/:variationId/skus - Create SKU for a variation
router.post('/variations/:variationId/skus', async (req: Request, res: Response) => {
  try {
    const { variationId } = req.params;
    const validatedData = createSkuSchema.parse(req.body);

    const sku = await prisma.sku.create({
      data: {
        ...validatedData,
        variationId,
      },
    });

    res.status(201).json(sku);
  } catch (error) {
    throw error;
  }
});

// PUT /api/skus/:id - Update SKU
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateSkuSchema.parse(req.body);

    const sku = await prisma.sku.update({
      where: { id },
      data: validatedData,
    });

    res.json(sku);
  } catch (error) {
    throw error;
  }
});

// DELETE /api/skus/:id - Soft delete
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sku = await prisma.sku.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'SKU deactivated', sku });
  } catch (error) {
    throw error;
  }
});

export default router;
