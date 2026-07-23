import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

export function createApp() {
  const app = express();

  app.use(cors({ origin: 'http://localhost:5173' }));
  app.use(express.json());

  app.use('/tasks', taskRoutes);
  app.use(errorHandler);

  return app;
}
