import type { Task } from '../types/task.ts';
import { supabase } from '../config/supabase.ts';

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from<Task>('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const { data, error } = await supabase.from<Task>('tasks').insert([task]).select().single();

  if (error) throw error;
  return data;
}

export async function updateTask(id: string, updates: Partial<Pick<Task, 'status'>>): Promise<Task> {
  const { data, error } = await supabase
    .from<Task>('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
