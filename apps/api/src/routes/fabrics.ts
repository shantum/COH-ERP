import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../prisma.js';

const router = Router();

// Validation schemas
const createFabricTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  composition: z.string().min(1, 'Composition is required'),
  unit: z.enum(['METER', 'KG']),
  avgShrinkagePct: z.number().nonnegative().default(0),
});

const updateFabricTypeSchema = createFabricTypeSchema.partial();

const createFabricSchema = z.object({
  fabricTypeId: z.string().uuid('Invalid fabric type ID'),
  name: z.string().min(1, 'Name is required'),
  colorName: z.string().min(1, 'Color name is required'),
  colorHex: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color').optional(),
  costPerUnit: z.number().positive('Cost must be positive'),
  leadTimeDays: z.number().int().positive().default(14),
  minOrderQty: z.number().positive().default(50),
  isActive: z.boolean().default(true),
});

const updateFabricSchema = createFabricSchema.partial();

const createTransactionSchema = z.object({
  txnType: z.enum(['INWARD', 'OUTWARD']),
  qty: z.number().positive('Quantity must be positive'),
  reason: z.enum(['SUPPLIER_RECEIPT', 'PRODUCTION', 'SHRINKAGE', 'DAMAGE', 'ADJUSTMENT']),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
  createdBy: z.string().optional(),
});

// Helper function to calculate fabric balance
async function getFabricBalance(fabricId: string) {
  const transactions = await prisma.fabricTransaction.findMany({
    where: { fabricId },
  });

  const balance = transactions.reduce((acc, txn) => {
    if (txn.txnType === 'INWARD') {
      return acc + Number(txn.qty);
    } else {
      return acc - Number(txn.qty);
    }
  }, 0);

  return balance;
}

// Fabric Type Routes
router.get('/fabric-types', async (req: Request, res: Response) => {
  try {
    const fabricTypes = await prisma.fabricType.findMany({
      include: {
        _count: {
          select: {
            fabrics: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(fabricTypes);
  } catch (error) {
    throw error;
  }
});

router.post('/fabric-types', async (req: Request, res: Response) => {
  try {
    const validatedData = createFabricTypeSchema.parse(req.body);

    const fabricType = await prisma.fabricType.create({
      data: validatedData,
    });

    res.status(201).json(fabricType);
  } catch (error) {
    throw error;
  }
});

router.put('/fabric-types/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateFabricTypeSchema.parse(req.body);

    const fabricType = await prisma.fabricType.update({
      where: { id },
      data: validatedData,
    });

    res.json(fabricType);
  } catch (error) {
    throw error;
  }
});

// Fabric Routes
router.get('/', async (req: Request, res: Response) => {
  try {
    const fabrics = await prisma.fabric.findMany({
      include: {
        fabricType: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Calculate balance for each fabric
    const fabricsWithBalance = await Promise.all(
      fabrics.map(async (fabric) => {
        const balance = await getFabricBalance(fabric.id);
        return {
          ...fabric,
          balance,
        };
      })
    );

    res.json(fabricsWithBalance);
  } catch (error) {
    throw error;
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fabric = await prisma.fabric.findUnique({
      where: { id },
      include: {
        fabricType: true,
        variations: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!fabric) {
      return res.status(404).json({ error: 'Fabric not found' });
    }

    const balance = await getFabricBalance(id);

    res.json({
      ...fabric,
      balance,
    });
  } catch (error) {
    throw error;
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createFabricSchema.parse(req.body);

    const fabric = await prisma.fabric.create({
      data: validatedData,
      include: {
        fabricType: true,
      },
    });

    res.status(201).json(fabric);
  } catch (error) {
    throw error;
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateFabricSchema.parse(req.body);

    const fabric = await prisma.fabric.update({
      where: { id },
      data: validatedData,
      include: {
        fabricType: true,
      },
    });

    res.json(fabric);
  } catch (error) {
    throw error;
  }
});

// Fabric Balance & Transactions
router.get('/:id/balance', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const fabric = await prisma.fabric.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });

    if (!fabric) {
      return res.status(404).json({ error: 'Fabric not found' });
    }

    const balance = await getFabricBalance(id);

    res.json({
      fabricId: id,
      fabricName: fabric.name,
      balance,
      unit: 'METER',
    });
  } catch (error) {
    throw error;
  }
});

router.get('/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const transactions = await prisma.fabricTransaction.findMany({
      where: { fabricId: id },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(transactions);
  } catch (error) {
    throw error;
  }
});

router.post('/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = createTransactionSchema.parse(req.body);

    // Verify fabric exists
    const fabric = await prisma.fabric.findUnique({
      where: { id },
    });

    if (!fabric) {
      return res.status(404).json({ error: 'Fabric not found' });
    }

    // If OUTWARD, check if sufficient balance
    if (validatedData.txnType === 'OUTWARD') {
      const currentBalance = await getFabricBalance(id);
      if (currentBalance < validatedData.qty) {
        return res.status(400).json({
          error: 'Insufficient fabric balance',
          currentBalance,
          requested: validatedData.qty,
        });
      }
    }

    const transaction = await prisma.fabricTransaction.create({
      data: {
        ...validatedData,
        fabricId: id,
      },
    });

    const newBalance = await getFabricBalance(id);

    res.status(201).json({
      transaction,
      newBalance,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
