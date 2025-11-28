const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function seed() {
  try {
    console.log('Starting seed from store-data.ts...');
    
    // Read and parse the TypeScript file content
    const storeDataPath = path.join(__dirname, '../prisma/store-data.ts');
    const fileContent = fs.readFileSync(storeDataPath, 'utf-8');
    
    // Extract the storeData array from the file - find everything between const storeData = [ and ];
    const startIndex = fileContent.indexOf('const storeData = [');
    const endIndex = fileContent.lastIndexOf('];');
    
    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Could not find storeData array in file');
    }
    
    // Extract the JSON array part
    const jsonArray = fileContent.substring(startIndex + 'const storeData = '.length, endIndex + 1);
    
    // Parse as JSON
    const storeData = JSON.parse(jsonArray);
    
    // Clear existing locations
    const deleteResult = await prisma.location.deleteMany({});
    console.log(`Cleared ${deleteResult.count} existing locations`);
    
    console.log(`Found ${storeData.length} stores in store-data.ts`);
    
    const batchSize = 50;
    let insertedCount = 0;
    
    for (let i = 0; i < storeData.length; i += batchSize) {
      const batch = storeData.slice(i, i + batchSize).map(store => {
        const { createDate, updateDate, ...cleanStore } = store;
        return cleanStore;
      });
      
      try {
        await prisma.location.createMany({
          data: batch,
        });
        insertedCount += batch.length;
        console.log(`Inserted ${insertedCount}/${storeData.length} stores...`);
      } catch (batchError) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, batchError.message);
        // Try inserting one by one to find the problematic record
        for (const store of batch) {
          try {
            await prisma.location.create({ data: store });
            insertedCount++;
          } catch (singleError) {
            console.error(`Failed to insert: ${store.shopName}`, singleError.message);
          }
        }
      }
    }
    
    console.log(`\nSuccessfully inserted ${insertedCount} stores!`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();

