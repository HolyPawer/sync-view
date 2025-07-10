import path from 'path';

export const config = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  watchPath: process.env.WATCH_PATH || path.join(process.cwd(), 'files'),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'
}; 