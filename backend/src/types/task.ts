export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'normal' | 'high';
  due_date?: string;
  status: TaskStatus;
  user_id: string;
  created_at: string;
};
