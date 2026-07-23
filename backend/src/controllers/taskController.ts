import type { Request, Response } from 'express';
import { createTask, getTasksByUser, updateTask } from '../services/taskService.ts';

export async function fetchTasks(req: Request, res: Response) {
  try {
    const userId = req.query.user_id as string;
    if (!userId) return res.status(400).json({ error: 'Missing user_id query parameter' });

    const tasks = await getTasksByUser(userId);
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function addTask(req: Request, res: Response) {
  try {
    const task = req.body;
    const created = await createTask(task);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function changeTaskStatus(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    const updates = req.body;
    const updated = await updateTask(taskId, updates);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
