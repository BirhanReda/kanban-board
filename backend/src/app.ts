import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.ts';
import healthRoutes from './routes/healthRoutes.ts';
import { errorHandler } from './middleware/errorHandler.ts';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5178' }));
  app.use(express.json());

  app.use('/health', healthRoutes);
  app.use('/tasks', taskRoutes);
  app.use(errorHandler);

  return app;
}
