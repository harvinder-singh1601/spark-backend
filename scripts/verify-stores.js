const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyStores() {
  try {
    const stores = await prisma.location.findMany({
      select: {
        shopName: true,
        city: true,
        banners: true,
        lat: true,
        lng: true,
      },
      orderBy: { createDate: 'desc' },
    });

    console.log(`\nTotal stores in database: ${stores.length}\n`);
    
    // Check for dummy store names
    const dummyNames = [
      'Spark Cannabis - Downtown Toronto',
      'Green Leaf Vancouver',
      'Northern Lights Cannabis - Calgary',
      'Spark Cannabis - Montreal',
      'High Times Ottawa',
      'Spark Cannabis - Winnipeg',
      'Pacific Cannabis - Victoria',
      'Spark Cannabis - Halifax',
      'Cannabis Express - Edmonton',
      'Green Valley - Saskatoon',
      'Cannabis Central - Regina',
      'Atlantic Cannabis - Moncton',
      'Spark Cannabis - Mississauga',
    ];

    const dummyStores = stores.filter(store => 
      dummyNames.some(name => store.shopName.includes(name.split(' - ')[0]))
    );

    if (dummyStores.length > 0) {
      console.log(`Found ${dummyStores.length} potential dummy stores:\n`);
      dummyStores.forEach(store => {
        console.log(`  - ${store.shopName} (${store.city})`);
      });
    } else {
      console.log('No dummy stores found - all stores are from CSV\n');
    }

    // Show first 10 stores
    console.log('First 10 stores:\n');
    stores.slice(0, 10).forEach((store, index) => {
      console.log(`${index + 1}. ${store.shopName}`);
      console.log(`   City: ${store.city}, Banner: ${store.banners[0] || 'N/A'}`);
      console.log(`   Coordinates: ${store.lat}, ${store.lng}\n`);
    });

    // Count stores with missing coordinates
    const missingCoords = stores.filter(s => s.lat === 0 && s.lng === 0);
    console.log(`\nStores with missing coordinates (lat/lng = 0): ${missingCoords.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyStores();


