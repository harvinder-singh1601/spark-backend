const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetDatabase() {
  console.log('Starting database reset...');
  
  try {
    console.log('Deleting geo locations...');
    await prisma.geoLocation.deleteMany({});
    console.log('Geo locations deleted');

    console.log('Deleting stores/locations...');
    await prisma.location.deleteMany({});
    console.log('Stores deleted');

    console.log('Deleting blogs...');
    await prisma.blog.deleteMany({});
    console.log('Blogs deleted');

    console.log('Deleting products...');
    await prisma.product.deleteMany({});
    console.log('Products deleted');

    console.log('Deleting all users...');
    await prisma.user.deleteMany({});
    console.log('All users deleted');

    console.log('\nDatabase reset completed successfully!');
    console.log('You can now run: npm run db:seed');
  } catch (error) {
    console.error('Error resetting database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resetDatabase();

