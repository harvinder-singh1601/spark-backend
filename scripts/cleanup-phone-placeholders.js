const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupPhonePlaceholders() {
  try {
    console.log('Starting cleanup of phone number placeholders...');
    
    // Find all locations with the placeholder phone number
    const locationsWithPlaceholder = await prisma.location.findMany({
      where: {
        ownerPhone: '+1-000-000-0000',
      },
      select: {
        id: true,
        shopName: true,
        ownerPhone: true,
      },
    });

    console.log(`Found ${locationsWithPlaceholder.length} locations with placeholder phone number`);

    if (locationsWithPlaceholder.length === 0) {
      console.log('No placeholder phone numbers found. Database is clean!');
      await prisma.$disconnect();
      process.exit(0);
    }

    // Update all placeholder phone numbers to null
    const updateResult = await prisma.location.updateMany({
      where: {
        ownerPhone: '+1-000-000-0000',
      },
      data: {
        ownerPhone: null,
      },
    });

    console.log(`\n✓ Successfully updated ${updateResult.count} locations`);
    console.log('All placeholder phone numbers have been set to null');
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Cleanup failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

cleanupPhonePlaceholders();

