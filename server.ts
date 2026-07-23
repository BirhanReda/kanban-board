import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

app.get('/tasks', async (req, res) => {
  const userId = req.query.user_id as string;
  if (!userId) return res.status(400).json({ error: 'Missing user_id query parameter' });

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/tasks', async (req, res) => {
  const task = req.body;
  const { data, error } = await supabase.from('tasks').insert([task]).select().single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

app.patch('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updates = req.body;
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
