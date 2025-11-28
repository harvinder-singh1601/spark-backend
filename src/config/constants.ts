export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'Spark Delivery',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },
  
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  },

  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/spark?replicaSet=rs0&retryWrites=true&w=majority',
  },

  mongodb: {
    host: process.env.MONGODB_HOST || 'localhost',
    port: process.env.MONGODB_PORT || '27017',
    database: process.env.MONGODB_DATABASE || 'spark',
    replicaSet: process.env.MONGODB_REPLICA_SET || 'rs0',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || '',
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || '',
    tokenExpiry: process.env.TOKEN_EXPIRY || '7d',
  },

  googleMaps: {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  },

  pagination: {
    defaultLimit: 50,
    maxLimit: 100,
  },

  search: {
    defaultRadius: 50,
    maxRadius: 200,
    radiusSteps: [15, 25, 50, 100, 200],
  },
} as const;

export const isDevelopment = config.app.env === 'development';
export const isProduction = config.app.env === 'production';

export default config;


