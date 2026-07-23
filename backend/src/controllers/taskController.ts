import type { Request, Response } from 'express';
import type { Task, TaskStatus } from '../types/task.js';
import { createTask, deleteTask, getTasksByUser, updateTask } from '../services/taskService.js';

const validStatuses: TaskStatus[] = ['todo', 'in_progress', 'in_review', 'done'];
const validPriorities = ['low', 'normal', 'high'];

function validateTaskPayload(body: any): body is Omit<Task, 'id' | 'created_at'> {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof body.title === 'string' &&
    typeof body.user_id === 'string' &&
    typeof body.status === 'string' &&
    validStatuses.includes(body.status) &&
    (body.description === undefined || typeof body.description === 'string') &&
    (body.priority === undefined || validPriorities.includes(body.priority)) &&
    (body.due_date === undefined || typeof body.due_date === 'string')
  );
}

function validateTaskUpdates(body: any): body is Partial<Pick<Task, 'title' | 'description' | 'priority' | 'due_date' | 'status'>> {
  return (
    typeof body === 'object' &&
    body !== null &&
    Object.keys(body).length > 0 &&
    Object.entries(body).every(([key, value]) => {
      if (key === 'status') return typeof value === 'string' && validStatuses.includes(value as TaskStatus);
      if (key === 'priority') return typeof value === 'string' && validPriorities.includes(value as string);
      if (key === 'title') return typeof value === 'string';
      if (key === 'description') return typeof value === 'string';
      if (key === 'due_date') return typeof value === 'string';
      return false;
    })
  );
}

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
    if (!validateTaskPayload(req.body)) {
      return res.status(400).json({ error: 'Invalid task payload' });
    }

    const created = await createTask(req.body);
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function changeTaskStatus(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ error: 'Missing task id parameter' });

    if (!validateTaskUpdates(req.body)) {
      return res.status(400).json({ error: 'Invalid task update payload' });
    }

    const updated = await updateTask(taskId, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function removeTask(req: Request, res: Response) {
  try {
    const taskId = req.params.id;
    if (!taskId) return res.status(400).json({ error: 'Missing task id parameter' });

    const deleted = await deleteTask(taskId);
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
