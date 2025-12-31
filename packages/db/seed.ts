import { PrismaClient, ProductCategory, ProductType, Size, TargetStockMethod, FabricUnit } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.sku.deleteMany();
  await prisma.variation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.fabricTransaction.deleteMany();
  await prisma.fabric.deleteMany();
  await prisma.fabricType.deleteMany();

  // Create Fabric Types
  const linenFabricType = await prisma.fabricType.create({
    data: {
      name: 'Linen 60 Lea',
      composition: '100% Linen',
      unit: FabricUnit.METER,
      avgShrinkagePct: 3.5,
    },
  });

  const pimaCottonType = await prisma.fabricType.create({
    data: {
      name: 'Pima Cotton',
      composition: '100% Pima Cotton',
      unit: FabricUnit.METER,
      avgShrinkagePct: 2.0,
    },
  });

  // Create Fabrics
  const linenBlue = await prisma.fabric.create({
    data: {
      fabricTypeId: linenFabricType.id,
      name: 'Linen Wildflower Blue 60 Lea',
      colorName: 'Wildflower Blue',
      colorHex: '#6B9BD1',
      costPerUnit: 450,
      leadTimeDays: 14,
      minOrderQty: 100,
    },
  });

  const linenSageGreen = await prisma.fabric.create({
    data: {
      fabricTypeId: linenFabricType.id,
      name: 'Linen Sage Green 60 Lea',
      colorName: 'Sage Green',
      colorHex: '#9CAF88',
      costPerUnit: 450,
      leadTimeDays: 14,
      minOrderQty: 100,
    },
  });

  const pimaWhite = await prisma.fabric.create({
    data: {
      fabricTypeId: pimaCottonType.id,
      name: 'Pima Cotton White',
      colorName: 'White',
      colorHex: '#FFFFFF',
      costPerUnit: 280,
      leadTimeDays: 10,
      minOrderQty: 150,
    },
  });

  const pimaBlack = await prisma.fabric.create({
    data: {
      fabricTypeId: pimaCottonType.id,
      name: 'Pima Cotton Black',
      colorName: 'Black',
      colorHex: '#000000',
      costPerUnit: 280,
      leadTimeDays: 10,
      minOrderQty: 150,
    },
  });

  const linenBlack = await prisma.fabric.create({
    data: {
      fabricTypeId: linenFabricType.id,
      name: 'Linen Black 60 Lea',
      colorName: 'Black',
      colorHex: '#1A1A1A',
      costPerUnit: 450,
      leadTimeDays: 14,
      minOrderQty: 100,
    },
  });

  const linenBeige = await prisma.fabric.create({
    data: {
      fabricTypeId: linenFabricType.id,
      name: 'Linen Beige 60 Lea',
      colorName: 'Beige',
      colorHex: '#D4C5B9',
      costPerUnit: 450,
      leadTimeDays: 14,
      minOrderQty: 100,
    },
  });

  // Product 1: Linen MIDI Dress
  const linenmidiDress = await prisma.product.create({
    data: {
      name: 'Linen MIDI Dress',
      category: ProductCategory.DRESS,
      productType: ProductType.BASIC,
      baseProductionTimeMins: 60,
      variations: {
        create: [
          {
            colorName: 'Wildflower Blue',
            colorHex: '#6B9BD1',
            fabricId: linenBlue.id,
            skus: {
              create: [
                { skuCode: 'LMD-BLU-XS', size: Size.XS, fabricConsumption: 2.2, mrp: 3200, targetStockQty: 5 },
                { skuCode: 'LMD-BLU-S', size: Size.S, fabricConsumption: 2.3, mrp: 3200, targetStockQty: 10 },
                { skuCode: 'LMD-BLU-M', size: Size.M, fabricConsumption: 2.4, mrp: 3200, targetStockQty: 15 },
                { skuCode: 'LMD-BLU-L', size: Size.L, fabricConsumption: 2.5, mrp: 3200, targetStockQty: 12 },
                { skuCode: 'LMD-BLU-XL', size: Size.XL, fabricConsumption: 2.6, mrp: 3200, targetStockQty: 8 },
              ],
            },
          },
          {
            colorName: 'Sage Green',
            colorHex: '#9CAF88',
            fabricId: linenSageGreen.id,
            skus: {
              create: [
                { skuCode: 'LMD-SGR-XS', size: Size.XS, fabricConsumption: 2.2, mrp: 3200, targetStockQty: 5 },
                { skuCode: 'LMD-SGR-S', size: Size.S, fabricConsumption: 2.3, mrp: 3200, targetStockQty: 10 },
                { skuCode: 'LMD-SGR-M', size: Size.M, fabricConsumption: 2.4, mrp: 3200, targetStockQty: 15 },
                { skuCode: 'LMD-SGR-L', size: Size.L, fabricConsumption: 2.5, mrp: 3200, targetStockQty: 12 },
                { skuCode: 'LMD-SGR-XL', size: Size.XL, fabricConsumption: 2.6, mrp: 3200, targetStockQty: 8 },
              ],
            },
          },
        ],
      },
    },
  });

  // Product 2: Pima Cotton Tee
  const pimaTee = await prisma.product.create({
    data: {
      name: 'Pima Cotton Tee',
      category: ProductCategory.TOP,
      productType: ProductType.BASIC,
      baseProductionTimeMins: 30,
      variations: {
        create: [
          {
            colorName: 'White',
            colorHex: '#FFFFFF',
            fabricId: pimaWhite.id,
            skus: {
              create: [
                { skuCode: 'PCT-WHT-XS', size: Size.XS, fabricConsumption: 0.8, mrp: 1200, targetStockQty: 15 },
                { skuCode: 'PCT-WHT-S', size: Size.S, fabricConsumption: 0.9, mrp: 1200, targetStockQty: 20 },
                { skuCode: 'PCT-WHT-M', size: Size.M, fabricConsumption: 1.0, mrp: 1200, targetStockQty: 25 },
                { skuCode: 'PCT-WHT-L', size: Size.L, fabricConsumption: 1.1, mrp: 1200, targetStockQty: 20 },
                { skuCode: 'PCT-WHT-XL', size: Size.XL, fabricConsumption: 1.2, mrp: 1200, targetStockQty: 15 },
                { skuCode: 'PCT-WHT-XXL', size: Size.XXL, fabricConsumption: 1.3, mrp: 1200, targetStockQty: 10 },
              ],
            },
          },
          {
            colorName: 'Black',
            colorHex: '#000000',
            fabricId: pimaBlack.id,
            skus: {
              create: [
                { skuCode: 'PCT-BLK-XS', size: Size.XS, fabricConsumption: 0.8, mrp: 1200, targetStockQty: 15 },
                { skuCode: 'PCT-BLK-S', size: Size.S, fabricConsumption: 0.9, mrp: 1200, targetStockQty: 20 },
                { skuCode: 'PCT-BLK-M', size: Size.M, fabricConsumption: 1.0, mrp: 1200, targetStockQty: 25 },
                { skuCode: 'PCT-BLK-L', size: Size.L, fabricConsumption: 1.1, mrp: 1200, targetStockQty: 20 },
                { skuCode: 'PCT-BLK-XL', size: Size.XL, fabricConsumption: 1.2, mrp: 1200, targetStockQty: 15 },
                { skuCode: 'PCT-BLK-XXL', size: Size.XXL, fabricConsumption: 1.3, mrp: 1200, targetStockQty: 10 },
              ],
            },
          },
        ],
      },
    },
  });

  // Product 3: Wide Leg Linen Pants
  const linenPants = await prisma.product.create({
    data: {
      name: 'Wide Leg Linen Pants',
      category: ProductCategory.BOTTOM,
      productType: ProductType.BASIC,
      baseProductionTimeMins: 50,
      variations: {
        create: [
          {
            colorName: 'Black',
            colorHex: '#1A1A1A',
            fabricId: linenBlack.id,
            skus: {
              create: [
                { skuCode: 'WLP-BLK-S', size: Size.S, fabricConsumption: 1.8, mrp: 2800, targetStockQty: 10 },
                { skuCode: 'WLP-BLK-M', size: Size.M, fabricConsumption: 1.9, mrp: 2800, targetStockQty: 15 },
                { skuCode: 'WLP-BLK-L', size: Size.L, fabricConsumption: 2.0, mrp: 2800, targetStockQty: 12 },
                { skuCode: 'WLP-BLK-XL', size: Size.XL, fabricConsumption: 2.1, mrp: 2800, targetStockQty: 8 },
              ],
            },
          },
          {
            colorName: 'Beige',
            colorHex: '#D4C5B9',
            fabricId: linenBeige.id,
            skus: {
              create: [
                { skuCode: 'WLP-BGE-S', size: Size.S, fabricConsumption: 1.8, mrp: 2800, targetStockQty: 10 },
                { skuCode: 'WLP-BGE-M', size: Size.M, fabricConsumption: 1.9, mrp: 2800, targetStockQty: 15 },
                { skuCode: 'WLP-BGE-L', size: Size.L, fabricConsumption: 2.0, mrp: 2800, targetStockQty: 12 },
                { skuCode: 'WLP-BGE-XL', size: Size.XL, fabricConsumption: 2.1, mrp: 2800, targetStockQty: 8 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Created fabric types:');
  console.log(`  - ${linenFabricType.name} (${linenFabricType.composition})`);
  console.log(`  - ${pimaCottonType.name} (${pimaCottonType.composition})`);

  console.log('\n✅ Created products:');
  console.log(`  - ${linenmidiDress.name} (${linenmidiDress.category})`);
  console.log(`  - ${pimaTee.name} (${pimaTee.category})`);
  console.log(`  - ${linenPants.name} (${linenPants.category})`);

  // Count totals
  const fabricTypeCount = await prisma.fabricType.count();
  const fabricCount = await prisma.fabric.count();
  const productCount = await prisma.product.count();
  const variationCount = await prisma.variation.count();
  const skuCount = await prisma.sku.count();

  console.log('\n📊 Summary:');
  console.log(`  Fabric Types: ${fabricTypeCount}`);
  console.log(`  Fabrics: ${fabricCount}`);
  console.log(`  Products: ${productCount}`);
  console.log(`  Variations: ${variationCount}`);
  console.log(`  SKUs: ${skuCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
