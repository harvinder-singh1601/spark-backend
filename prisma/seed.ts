import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Check if data already exists
  const existingUsers = await prisma.user.count();
  const existingProducts = await prisma.product.count();
  const existingBlogs = await prisma.blog.count();
  const existingStores = await prisma.location.count();
  const existingLocations = await prisma.geoLocation.count();

  // Ensure admin user exists
  const adminPassword = await bcrypt.hash('12345', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      password: adminPassword,
      fullname: 'Admin User',
    },
    create: {
      fullname: 'Admin User',
      email: 'admin@gmail.com',
      password: adminPassword,
    },
  });
  console.log('✓ Admin user (admin@gmail.com) ensured');

  // Only skip if stores already exist (allow re-seeding stores if needed)
  if (existingStores > 0) {
    console.log(`Found ${existingStores} stores already in database.`);
    console.log('Deleting existing stores to re-seed with fresh data...');
    await prisma.location.deleteMany({});
    console.log('✓ Existing stores deleted');
  }
  
  if (existingUsers > 0 || existingProducts > 0 || existingBlogs > 0 || existingLocations > 0) {
    console.log('Database already contains other data.');
    console.log(`Found ${existingUsers} users, ${existingProducts} products, ${existingBlogs} blogs, and ${existingLocations} service locations.`);
    console.log('Seeding stores only...');
  }

  console.log('Seeding users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user1 = await prisma.user.create({
    data: {
      fullname: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
    },
  });
  const user2 = await prisma.user.create({
    data: {
      fullname: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
    },
  });
  const user3 = await prisma.user.create({
    data: {
      fullname: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
    },
  });
  console.log('Created 3 users');

  console.log('Seeding products...');
  const placeholderProduct = 'https://placehold.co/400x400/10b981/ffffff?text=';
  const productData = [
      {
        name: 'Blue Dream',
        customer: 'John Doe',
        quantity: '50',
        status: 'In Stock',
        price: '12.99',
        imageUrl: placeholderProduct + 'Blue+Dream',
      },
      {
        name: 'OG Kush',
        customer: 'Jane Smith',
        quantity: '30',
        status: 'In Stock',
        price: '14.99',
        imageUrl: placeholderProduct + 'OG+Kush',
      },
      {
        name: 'Sour Diesel',
        customer: 'John Doe',
        quantity: '75',
        status: 'In Stock',
        price: '13.99',
        imageUrl: placeholderProduct + 'Sour+Diesel',
      },
      {
        name: 'Girl Scout Cookies',
        customer: 'Jane Smith',
        quantity: '25',
        status: 'Low Stock',
        price: '15.99',
        imageUrl: placeholderProduct + 'GSC',
      },
      {
        name: 'Northern Lights',
        customer: 'Admin User',
        quantity: '100',
        status: 'In Stock',
        price: '11.99',
        imageUrl: placeholderProduct + 'Northern+Lights',
      },
      {
        name: 'Pineapple Express',
        customer: 'John Doe',
        quantity: '60',
        status: 'In Stock',
        price: '13.49',
        imageUrl: placeholderProduct + 'Pineapple+Express',
      },
      {
        name: 'Granddaddy Purple',
        customer: 'Jane Smith',
        quantity: '40',
        status: 'In Stock',
        price: '14.49',
        imageUrl: placeholderProduct + 'GDP',
      },
      {
        name: 'White Widow',
        customer: 'Admin User',
        quantity: '20',
        status: 'Low Stock',
        price: '12.49',
        imageUrl: placeholderProduct + 'White+Widow',
      },
      {
        name: 'Jack Herer',
        customer: 'John Doe',
        quantity: '35',
        status: 'In Stock',
        price: '15.49',
        imageUrl: placeholderProduct + 'Jack+Herer',
      },
      {
        name: 'Gelato',
        customer: 'Jane Smith',
        quantity: '45',
        status: 'In Stock',
        price: '16.99',
        imageUrl: placeholderProduct + 'Gelato',
      },
      {
        name: 'Wedding Cake',
        customer: 'Admin User',
        quantity: '55',
        status: 'In Stock',
        price: '15.99',
        imageUrl: placeholderProduct + 'Wedding+Cake',
      },
      {
        name: 'Zkittlez',
        customer: 'John Doe',
        quantity: '80',
        status: 'In Stock',
        price: '14.99',
        imageUrl: placeholderProduct + 'Zkittlez',
      },
      {
        name: 'Gorilla Glue',
        customer: 'Jane Smith',
        quantity: '90',
        status: 'In Stock',
        price: '13.99',
        imageUrl: placeholderProduct + 'Gorilla+Glue',
      },
      {
        name: 'Purple Haze',
        customer: 'Admin User',
        quantity: '65',
        status: 'In Stock',
        price: '14.99',
        imageUrl: placeholderProduct + 'Purple+Haze',
      },
      {
        name: 'Bubba Kush',
        customer: 'John Doe',
        quantity: '50',
        status: 'In Stock',
        price: '13.49',
        imageUrl: placeholderProduct + 'Bubba+Kush',
      },
      {
        name: 'Strawberry Cough',
        customer: 'Jane Smith',
        quantity: '30',
        status: 'Low Stock',
        price: '15.49',
        imageUrl: placeholderProduct + 'Strawberry+Cough',
      },
  ];

  let productCount = 0;
  for (const product of productData) {
    await prisma.product.create({ data: product });
    productCount++;
  }
  console.log(`Created ${productCount} products`);

  console.log('Seeding blogs...');
  const placeholderBlog = 'https://placehold.co/800x400/10b981/ffffff?text=';
  const blogData = [
    {
      title: 'Understanding Cannabis Strains: Indica vs Sativa vs Hybrid',
      slug: 'understanding-cannabis-strains',
      content: `# Understanding Cannabis Strains: Indica vs Sativa vs Hybrid

Choosing the right cannabis strain can make all the difference in your experience. In this comprehensive guide, we'll explore the three main types of cannabis and their effects.

## Indica Strains

- **Effects**: Relaxing, calming, full-body high
- **Best for**: Evening use, relaxation, sleep
- **Popular strains**: Northern Lights, Granddaddy Purple, Bubba Kush

## Sativa Strains

- **Effects**: Energizing, uplifting, cerebral high
- **Best for**: Daytime use, creativity, socializing
- **Popular strains**: Sour Diesel, Jack Herer, Pineapple Express

## Hybrid Strains

- **Effects**: Balanced combination of indica and sativa
- **Best for**: Versatile use, customized experience
- **Popular strains**: Blue Dream, Girl Scout Cookies, Gelato

## Conclusion

Understanding the differences between cannabis strains helps you make informed choices for your desired experience.`,
      excerpt: 'A comprehensive guide to understanding indica, sativa, and hybrid cannabis strains',
      author: 'John Doe',
      featuredImage: placeholderBlog + 'Cannabis+Strains',
      tags: ['cannabis', 'education', 'strains'],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: 'Top 10 Cannabis Strains for Beginners in Canada',
      slug: 'top-cannabis-strains-for-beginners',
      content: `# Top 10 Cannabis Strains for Beginners in Canada

New to cannabis? Here are the best strains to start your journey with balanced effects and manageable potency.

## Why These Strains?

- Moderate THC levels
- Pleasant flavors and aromas
- Predictable, gentle effects
- Widely available across Canada

## Our Top Picks

1. **Blue Dream** - Balanced hybrid with sweet berry flavor
2. **Northern Lights** - Gentle indica for relaxation
3. **Pineapple Express** - Mild sativa for daytime use
4. **Wedding Cake** - Smooth hybrid with calming effects
5. **White Widow** - Classic balanced strain

## Tips for Beginners

- Start with low doses
- Wait at least 2 hours before consuming more
- Stay hydrated and have snacks ready
- Choose a comfortable, familiar environment

## Conclusion

These beginner-friendly strains provide a great introduction to cannabis while minimizing the risk of overwhelming effects.`,
      excerpt: 'Discover the best cannabis strains for beginners available in Canada',
      author: 'Jane Smith',
      featuredImage: placeholderBlog + 'Beginner+Guide',
      tags: ['cannabis', 'beginners', 'guide', 'canada'],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: 'The Benefits of Cannabis Delivery Services',
      slug: 'benefits-of-cannabis-delivery',
      content: `# The Benefits of Cannabis Delivery Services

Cannabis delivery services have revolutionized how Canadians access their favorite products. Here's why delivery is the future.

## Convenience

No need to travel to a dispensary. Browse, order, and receive products from the comfort of your home.

## Privacy

Discreet packaging and delivery ensure your privacy is protected.

## Selection

Access to a wider range of products and strains than typical retail stores.

## Safety

Especially important during cold Canadian winters or for those with mobility challenges.

## Expert Guidance

Many delivery services offer consultation to help you choose the right products.

## How Spark Delivery Works

1. Enter your address
2. Browse available products
3. Place your order
4. Receive fast, discreet delivery

## Conclusion

Cannabis delivery combines convenience, privacy, and selection to provide the best shopping experience.`,
      excerpt: 'Learn why cannabis delivery is becoming the preferred choice for Canadians',
      author: 'Admin User',
      featuredImage: placeholderBlog + 'Delivery+Service',
      tags: ['delivery', 'cannabis', 'convenience', 'canada'],
      published: true,
      publishedAt: new Date(),
    },
    {
      title: 'Cannabis Storage Tips: Keeping Your Products Fresh',
      slug: 'cannabis-storage-tips',
      content: `# Cannabis Storage Tips: Keeping Your Products Fresh

Proper storage is essential for maintaining the quality, potency, and flavor of your cannabis products.

## Key Storage Principles

- Keep away from light
- Control humidity (55-62% RH ideal)
- Maintain cool temperature (60-70°F)
- Use airtight containers

## Best Containers

Glass jars with airtight seals are ideal. Avoid plastic bags for long-term storage.

## What to Avoid

- Direct sunlight or bright light
- Extreme temperatures
- Excessive air exposure
- Humid environments

## Shelf Life

Properly stored cannabis can maintain quality for 6-12 months or longer.

## Conclusion

Following these storage tips ensures your cannabis products stay fresh and potent until you're ready to enjoy them.`,
      excerpt: 'Essential tips for storing your cannabis products to maintain freshness and potency',
      author: 'John Doe',
      featuredImage: placeholderBlog + 'Storage+Tips',
      tags: ['cannabis', 'storage', 'tips', 'education'],
      published: false,
    },
  ];

  let blogCount = 0;
  for (const blog of blogData) {
    await prisma.blog.create({ data: blog });
    blogCount++;
  }
  console.log(`Created ${blogCount} blogs`);

  console.log('Seeding stores (cannabis dispensaries)...');
  
  let storeData: any[] = [];
  try {
    const storeDataModule = require('./store-data');
    storeData = storeDataModule.default || storeDataModule || [];
    console.log(`Loaded ${storeData.length} stores from CSV`);
  } catch (error: any) {
    console.error('Error loading store-data.ts:', error?.message || error);
    console.warn('Using empty fallback - please ensure CSV is parsed first');
    storeData = [];
  }
  
  const storesNeedingGeocoding = storeData.filter((store: any) => store.lat === 0 || store.lng === 0);
  
  if (storesNeedingGeocoding.length > 0) {
    console.log(`Note: ${storesNeedingGeocoding.length} stores have lat/lng = 0 (missing coordinates)`);
  }
  
  if (storeData.length === 0) {
    console.warn('No valid stores to seed. Please ensure CSV is parsed and stores have coordinates.');
    return;
  }
  
  let storeCount = 0;
  for (const store of storeData) {
    await prisma.location.create({ data: store });
    storeCount++;
  }
  console.log(`Created ${storeCount} cannabis dispensaries`);

  console.log('Seeding service locations...');
  const serviceLocationData = [
    { city: 'Toronto', state: 'ON', zipCode: 'M5H', country: 'Canada', lat: 43.6532, lng: -79.3832 },
    { city: 'Mississauga', state: 'ON', zipCode: 'L5B', country: 'Canada', lat: 43.5890, lng: -79.6441 },
    { city: 'Brampton', state: 'ON', zipCode: 'L6T', country: 'Canada', lat: 43.7315, lng: -79.7624 },
    { city: 'Hamilton', state: 'ON', zipCode: 'L8P', country: 'Canada', lat: 43.2557, lng: -79.8711 },
    { city: 'Ottawa', state: 'ON', zipCode: 'K1P', country: 'Canada', lat: 45.4215, lng: -75.6972 },
    { city: 'London', state: 'ON', zipCode: 'N6A', country: 'Canada', lat: 42.9849, lng: -81.2453 },
    { city: 'Kitchener', state: 'ON', zipCode: 'N2H', country: 'Canada', lat: 43.4516, lng: -80.4925 },
    { city: 'Markham', state: 'ON', zipCode: 'L3R', country: 'Canada', lat: 43.8561, lng: -79.3370 },
    { city: 'Vaughan', state: 'ON', zipCode: 'L4K', country: 'Canada', lat: 43.8361, lng: -79.4983 },
    { city: 'Windsor', state: 'ON', zipCode: 'N9A', country: 'Canada', lat: 42.3149, lng: -83.0364 },
    { city: 'Vancouver', state: 'BC', zipCode: 'V6B', country: 'Canada', lat: 49.2827, lng: -123.1207 },
    { city: 'Surrey', state: 'BC', zipCode: 'V3T', country: 'Canada', lat: 49.1913, lng: -122.8490 },
    { city: 'Burnaby', state: 'BC', zipCode: 'V5H', country: 'Canada', lat: 49.2488, lng: -122.9805 },
    { city: 'Richmond', state: 'BC', zipCode: 'V6Y', country: 'Canada', lat: 49.1666, lng: -123.1336 },
    { city: 'Victoria', state: 'BC', zipCode: 'V8W', country: 'Canada', lat: 48.4284, lng: -123.3656 },
    { city: 'Coquitlam', state: 'BC', zipCode: 'V3K', country: 'Canada', lat: 49.2838, lng: -122.7932 },
    { city: 'Kelowna', state: 'BC', zipCode: 'V1Y', country: 'Canada', lat: 49.8880, lng: -119.4960 },
    { city: 'Abbotsford', state: 'BC', zipCode: 'V2S', country: 'Canada', lat: 49.0504, lng: -122.3045 },
    { city: 'Calgary', state: 'AB', zipCode: 'T2P', country: 'Canada', lat: 51.0447, lng: -114.0719 },
    { city: 'Edmonton', state: 'AB', zipCode: 'T5J', country: 'Canada', lat: 53.5461, lng: -113.4938 },
    { city: 'Red Deer', state: 'AB', zipCode: 'T4N', country: 'Canada', lat: 52.2681, lng: -113.8111 },
    { city: 'Lethbridge', state: 'AB', zipCode: 'T1J', country: 'Canada', lat: 49.6942, lng: -112.8328 },
    { city: 'Fort McMurray', state: 'AB', zipCode: 'T9H', country: 'Canada', lat: 56.7267, lng: -111.3790 },
    { city: 'Montreal', state: 'QC', zipCode: 'H2X', country: 'Canada', lat: 45.5017, lng: -73.5673 },
    { city: 'Quebec City', state: 'QC', zipCode: 'G1R', country: 'Canada', lat: 46.8139, lng: -71.2080 },
    { city: 'Laval', state: 'QC', zipCode: 'H7N', country: 'Canada', lat: 45.6066, lng: -73.7124 },
    { city: 'Gatineau', state: 'QC', zipCode: 'J8T', country: 'Canada', lat: 45.4765, lng: -75.7013 },
    { city: 'Longueuil', state: 'QC', zipCode: 'J4H', country: 'Canada', lat: 45.5312, lng: -73.5182 },
    { city: 'Sherbrooke', state: 'QC', zipCode: 'J1H', country: 'Canada', lat: 45.4042, lng: -71.8929 },
    { city: 'Winnipeg', state: 'MB', zipCode: 'R3C', country: 'Canada', lat: 49.8951, lng: -97.1384 },
    { city: 'Brandon', state: 'MB', zipCode: 'R7A', country: 'Canada', lat: 49.8483, lng: -99.9501 },
    { city: 'Saskatoon', state: 'SK', zipCode: 'S7K', country: 'Canada', lat: 52.1332, lng: -106.6700 },
    { city: 'Regina', state: 'SK', zipCode: 'S4P', country: 'Canada', lat: 50.4452, lng: -104.6189 },
    { city: 'Halifax', state: 'NS', zipCode: 'B3H', country: 'Canada', lat: 44.6488, lng: -63.5752 },
    { city: 'Dartmouth', state: 'NS', zipCode: 'B2Y', country: 'Canada', lat: 44.6715, lng: -63.5770 },
    { city: 'Moncton', state: 'NB', zipCode: 'E1C', country: 'Canada', lat: 46.0878, lng: -64.7782 },
    { city: 'Saint John', state: 'NB', zipCode: 'E2L', country: 'Canada', lat: 45.2733, lng: -66.0633 },
    { city: 'Fredericton', state: 'NB', zipCode: 'E3B', country: 'Canada', lat: 45.9636, lng: -66.6431 },
  ];

  let locationCount = 0;
  for (const location of serviceLocationData) {
    await prisma.geoLocation.create({ data: location });
    locationCount++;
  }
  console.log(`Created ${locationCount} service locations`);

  console.log('\nDatabase seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`   - ${productCount} cannabis products/strains`);
  console.log(`   - ${blogCount} blog posts`);
  console.log(`   - ${storeCount} cannabis dispensary stores`);
  console.log(`   - ${locationCount} service locations (cities we deliver to)`);
  console.log('\nSample login credentials:');
  console.log('   Email: admin@gmail.com');
  console.log('   Password: 12345');
  console.log('\n   Email: john.doe@example.com');
  console.log('   Password: password123');
  console.log('\n   Email: jane.smith@example.com');
  console.log('   Password: password123');
  console.log('\n   Email: admin@example.com');
  console.log('   Password: password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

