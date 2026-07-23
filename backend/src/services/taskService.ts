import type { Task } from '../types/task.js';
import { supabase } from '../config/supabase.js';

export async function getTasksByUser(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const { data, error } = await supabase.from('tasks').insert([task]).select().single();

  if (error) throw error;
  return data;
}

export async function updateTask(
  id: string,
  updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'due_date' | 'status'>>,
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTask(id: string): Promise<Task | null> {
  const { data, error } = await supabase.from('tasks').delete().eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }

  return data ?? null;
}
