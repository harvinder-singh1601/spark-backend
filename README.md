# Spark Delivery

A modern delivery and store locator platform built with Next.js and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- Google Maps API key

## Setup

1. Start MongoDB:
```bash
docker-compose up -d
```

2. Configure environment variables:
```bash
cp env.template .env
```

Then edit `.env` and add your configuration:
- Update `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your Google Maps API key
- Update `JWT_SECRET` with a secure secret key
- Adjust database connection settings if needed (see `env.template` for all options)

3. Install dependencies:
```bash
npm install
```

4. Seed the database:
```bash
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at the URL specified in your `.env` file (default: http://localhost:3000)

## Features

- Store locator with proximity search
- Blog management system
- User authentication
- Admin dashboard
- Location-based services

## Tech Stack

- Next.js 15
- Prisma ORM
- MongoDB
- TailwindCSS
- Google Maps API
