#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

const sampleBlogs = [
  {
    title: "How to Pick the Right Delta-8 Vape: Indica vs. Sativa Explained",
    slug: "how-to-pick-the-right-delta-8-vape",
    content: `
      <h2>Understanding Delta-8 THC</h2>
      <p>If you've ever taken a puff expecting to relax and instead found yourself suddenly wide awake, you've met the mystery of Indica vs. Sativa. These terms aren't just buzzwords; they shape the entire vaping experience, from your first inhale to how you wind down hours later.</p>
      
      <p>With Delta-8 vapes becoming the go-to for those who prefer balance over intensity, understanding what each strain brings to the table is key. It's not just about flavor — it's about feel.</p>
      
      <h3>What is Delta-8 THC?</h3>
      <p>Delta-8 THC sits in a fascinating space between CBD and Delta-9 THC (the main psychoactive compound in cannabis). It offers a similar sense of calm and euphoria but with less intensity, making it popular among users who want to stay clear-headed and functional.</p>
      
      <p>The compound is hemp-derived, which keeps it federally legal under the 2018 Farm Bill — as long as it contains less than 0.3% Delta-9 THC. Still, state laws vary, so it's smart to double-check what's allowed where you live.</p>
      
      <h3>Benefits of Delta-8 Vapes</h3>
      <p>What users love most about Delta-8 vapes is their ability to offer:</p>
      <ul>
        <li>A smoother, more balanced high</li>
        <li>Less anxiety or paranoia than traditional THC</li>
        <li>Fast onset through inhalation</li>
        <li>Discreet and convenient usage</li>
      </ul>
    `,
    excerpt: "If you've ever taken a puff expecting to relax and instead found yourself suddenly wide awake, you've met the mystery of Indica vs. Sativa.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog-1.png",
    tags: ["CANNABIS 101", "CANNABIS CULTURE"],
    published: true,
    publishedAt: new Date('2025-02-01'),
  },
  {
    title: "Montreal Cannabis Events: The Complete Guide",
    slug: "montreal-cannabis-events-guide",
    content: `
      <h2>Exploring Montreal's Cannabis Scene</h2>
      <p>From industry expos to chill community meetups, Montreal offers a vibrant cannabis culture that's worth exploring.</p>
      
      <h3>Annual Cannabis Events</h3>
      <p>Montreal hosts several major cannabis events throughout the year, bringing together enthusiasts, industry professionals, and curious newcomers.</p>
      
      <h3>Community Meetups</h3>
      <p>Beyond the big events, Montreal's cannabis community organizes regular meetups where you can learn, share experiences, and connect with like-minded individuals.</p>
    `,
    excerpt: "From industry expos to chill community meetups, here's how to explore Montreal's cannabis scene.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["LIFESTYLE", "INDUSTRY"],
    published: true,
    publishedAt: new Date('2025-01-28'),
  },
  {
    title: "Maple Ridge, BC Cannabis Delivery: Convenience Meets Quality",
    slug: "maple-ridge-delivery-meets-quality",
    content: `
      <h2>Cannabis Delivery in Maple Ridge</h2>
      <p>Doorstep delivery with top-shelf products. Here's what makes Maple Ridge stand out in the cannabis delivery space.</p>
      
      <h3>Fast and Reliable</h3>
      <p>Same-day delivery options ensure you get your products when you need them.</p>
      
      <h3>Quality Products</h3>
      <p>All products are lab-tested and sourced from trusted growers.</p>
    `,
    excerpt: "Doorstep delivery with top-shelf products. Here's what makes Maple Ridge stand out.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["LIFESTYLE"],
    published: true,
    publishedAt: new Date('2025-01-25'),
  },
  {
    title: "Vancouver Cannabis Events: What Not To Miss",
    slug: "vancouver-cannabis-events",
    content: `
      <h2>Vancouver's Cannabis Calendar</h2>
      <p>A quick look at markets, meetups, and experiences around Vancouver's cannabis culture.</p>
      
      <h3>Must-Attend Events</h3>
      <p>Vancouver hosts some of the most exciting cannabis events in Canada, from educational seminars to celebration gatherings.</p>
    `,
    excerpt: "A quick look at markets, meetups, and experiences around Vancouver's cannabis culture.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog-1.png",
    tags: ["CANNABIS CULTURE", "LIFESTYLE", "STRAINS"],
    published: true,
    publishedAt: new Date('2025-01-20'),
  },
  {
    title: "Toronto Cannabis Delivery: Same-Day Options Explained",
    slug: "toronto-cannabis-delivery",
    content: `
      <h2>Cannabis Delivery in Toronto</h2>
      <p>How Toronto's delivery services are making it easier than ever to get your favourites fast.</p>
      
      <h3>Same-Day Delivery</h3>
      <p>Order before 2 PM and receive your products the same day.</p>
    `,
    excerpt: "How Toronto's delivery services are making it easier than ever to get your favourites fast.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["INDUSTRY"],
    published: true,
    publishedAt: new Date('2025-01-18'),
  },
  {
    title: "BC Edibles Guide: Dosing, Timing, and What To Expect",
    slug: "bc-edibles-guide",
    content: `
      <h2>Your Guide to Cannabis Edibles</h2>
      <p>New to edibles? Here's how to start low, go slow, and actually enjoy the ride.</p>
      
      <h3>Dosing Guidelines</h3>
      <p>Start with 2.5-5mg THC and wait at least 2 hours before taking more.</p>
      
      <h3>What to Expect</h3>
      <p>Edibles take longer to kick in but provide longer-lasting effects compared to smoking or vaping.</p>
    `,
    excerpt: "New to edibles? Here's how to start low, go slow, and actually enjoy the ride.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog-1.png",
    tags: ["HEALTH", "RECIPES"],
    published: true,
    publishedAt: new Date('2025-01-15'),
  },
  {
    title: "Indica vs. Sativa Basics: What's The Real Difference?",
    slug: "sativa-vs-indica-basics",
    content: `
      <h2>Understanding Cannabis Strains</h2>
      <p>Short, simple breakdown of how these classic labels translate to real-life effects.</p>
      
      <h3>Indica Effects</h3>
      <p>Typically associated with relaxation and sedative effects.</p>
      
      <h3>Sativa Effects</h3>
      <p>Generally linked to energizing and uplifting experiences.</p>
    `,
    excerpt: "Short, simple breakdown of how these classic labels translate to real-life effects.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["CANNABIS 101"],
    published: true,
    publishedAt: new Date('2025-01-12'),
  },
  {
    title: "Grow Your Own: Beginner's Guide To Home Cannabis",
    slug: "grow-your-own-intro",
    content: `
      <h2>Home Cannabis Cultivation</h2>
      <p>Thinking about your first plant? Here are the fundamentals before you get started.</p>
      
      <h3>Legal Considerations</h3>
      <p>Check your local laws about home cultivation limits.</p>
      
      <h3>Getting Started</h3>
      <p>Basic equipment includes lights, nutrients, and growing medium.</p>
    `,
    excerpt: "Thinking about your first plant? Here are the fundamentals before you get started.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["GROW YOUR OWN"],
    published: true,
    publishedAt: new Date('2025-01-10'),
  },
  {
    title: "Easy Cannabis Recipes For Beginners",
    slug: "cannabis-recipes-beginners",
    content: `
      <h2>Cooking with Cannabis</h2>
      <p>A few simple infused recipes to try once you're comfortable with dosing.</p>
      
      <h3>Cannabis Butter</h3>
      <p>The foundation for most cannabis edibles.</p>
      
      <h3>Simple Brownies</h3>
      <p>A classic recipe that's hard to mess up.</p>
    `,
    excerpt: "A few simple infused recipes to try once you're comfortable with dosing.",
    author: "Spark Team",
    featuredImage: "/spark/blog/blog.png",
    tags: ["RECIPES", "LIFESTYLE"],
    published: true,
    publishedAt: new Date('2025-01-08'),
  },
];

async function seed() {
  try {
    console.log('Starting blog seed...');
    console.log('Connecting to database via Prisma...');

    // Clear existing blogs
    const deleteResult = await prisma.blog.deleteMany({});
    console.log(`Cleared ${deleteResult.count} existing blogs`);

    // Insert sample blogs
    for (const blog of sampleBlogs) {
      await prisma.blog.create({
        data: {
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          excerpt: blog.excerpt,
          author: blog.author,
          featuredImage: blog.featuredImage,
          tags: blog.tags,
          published: blog.published,
          publishedAt: blog.publishedAt,
        },
      });
    }

    console.log(`Inserted ${sampleBlogs.length} sample blogs`);
    console.log('Seed completed successfully!');
    console.log('\nNext steps:');
    console.log('   1. Start your dev server: npm run dev');
    console.log('   2. Visit: http://localhost:3000/blog');
    console.log('   3. Test API: curl http://localhost:3000/api/blog?published=true');

    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('ERROR: Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seed();



