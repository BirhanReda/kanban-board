import { useEffect, useMemo, useState } from 'react';
import { supabase } from './utils/supabase/client';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done';

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  description?: string;
  priority?: 'low' | 'normal' | 'high';
  due_date?: string;
};

const columnLabels: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  in_review: 'In Review',
  done: 'Done',
};

const defaultTask: Task = {
  id: '',
  title: '',
  status: 'todo',
  priority: 'normal',
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task>(defaultTask);
  const [isCreating, setIsCreating] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [guestUserId, setGuestUserId] = useState<string | null>(null);

  const columns = useMemo(
    () => Object.keys(columnLabels) as TaskStatus[],
    [],
  );

  useEffect(() => {
    async function init() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        let session = sessionData.session;
        if (!session) {
          const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
          if (anonError) throw anonError;
          session = anonData.session;
        }

        const userId = session?.user.id;
        setGuestUserId(userId ?? null);
        await loadTasks(userId ?? '');
      } catch (err) {
        setError('Unable to initialize session.');
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  async function loadTasks(userId: string) {
    const response = await fetch(`${API_URL}/tasks?user_id=${userId}`);
    if (!response.ok) {
      setError('Failed to load tasks.');
      return;
    }

    const data: Task[] = await response.json();
    setTasks(data);
  }

  async function handleCreateTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!activeTask.title.trim() || !guestUserId) return;

    setIsCreating(true);
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: activeTask.title,
        status: activeTask.status,
        description: activeTask.description,
        priority: activeTask.priority,
        due_date: activeTask.due_date,
        user_id: guestUserId,
      }),
    });

    if (!response.ok) {
      setError('Unable to create task.');
      setIsCreating(false);
      return;
    }

    const data: Task = await response.json();
    setTasks(prev => [...prev, data]);
    setActiveTask(defaultTask);
    setIsCreating(false);
  }

  async function handleStatusUpdate(taskId: string, status: TaskStatus) {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setError('Unable to update task status.');
      return;
    }

    setTasks(prev => prev.map(task => (task.id === taskId ? { ...task, status } : task)));
  }

  const taskColumns = useMemo(
    () =>
      columns.reduce((acc, status) => {
        acc[status] = tasks.filter(task => task.status === status);
        return acc;
      }, {} as Record<TaskStatus, Task[]>),
    [columns, tasks],
  );

  if (loading) {
    return <div className="app-shell">Loading your board…</div>;
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Guest workspace</p>
          <h1>Kanban task board</h1>
          <p className="subtext">Manage your tasks with real-time board updates and guest auth.</p>
        </div>
        <div className="stats-card">
          <p>Tasks</p>
          <strong>{tasks.length}</strong>
        </div>
      </header>

      <section className="create-panel">
        <form onSubmit={handleCreateTask} className="task-form">
          <div className="create-fields">
            <input
              value={activeTask.title}
              onChange={event => setActiveTask({ ...activeTask, title: event.target.value })}
              placeholder="New task title"
              aria-label="Task title"
            />
            <textarea
              value={activeTask.description ?? ''}
              onChange={event => setActiveTask({ ...activeTask, description: event.target.value })}
              placeholder="Optional description"
              rows={2}
            />
          </div>
          <div className="task-settings">
            <label>
              Priority
              <select
                value={activeTask.priority ?? 'normal'}
                onChange={event => setActiveTask({ ...activeTask, priority: event.target.value as Task['priority'] })}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              Due date
              <input
                type="date"
                value={activeTask.due_date ?? ''}
                onChange={event => setActiveTask({ ...activeTask, due_date: event.target.value })}
              />
            </label>
            <button type="submit" disabled={isCreating}>
              {isCreating ? 'Adding…' : 'Add task'}
            </button>
          </div>
        </form>
      </section>

      {error ? <div className="error-banner">{error}</div> : null}

      <main className="board-grid">
        {columns.map(status => (
          <section key={status} className="board-column">
            <div className="column-heading">
              <h2>{columnLabels[status]}</h2>
              <span>{taskColumns[status].length}</span>
            </div>
            <div
              className="column-body"
              onDragOver={event => event.preventDefault()}
              onDrop={() => draggedTaskId && handleStatusUpdate(draggedTaskId, status)}
            >
              {taskColumns[status].map(task => (
                <article
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={() => setDraggedTaskId(task.id)}
                  onDragEnd={() => setDraggedTaskId(null)}
                >
                  <strong>{task.title}</strong>
                  {task.description ? <p>{task.description}</p> : null}
                  <div className="task-meta">
                    <span className="badge">{task.priority ?? 'normal'}</span>
                    {task.due_date ? <span>{task.due_date}</span> : null}
                  </div>
                </article>
              ))}
              {taskColumns[status].length === 0 ? (
                <div className="empty-state">No tasks yet — drag one here when ready.</div>
              ) : null}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}

export default App;
