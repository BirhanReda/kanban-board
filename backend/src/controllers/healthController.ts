import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.ts';

export function healthCheck(req: Request, res: Response) {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

export async function supabaseHealthCheck(req: Request, res: Response) {
  try {
    const { error } = await supabase.from('tasks').select('id', { head: true, count: 'exact' });
    if (error) {
      return res.status(502).json({ status: 'error', message: 'Supabase query failed', details: error.message });
    }

    res.json({ status: 'ok', message: 'Supabase connection is healthy' });
  } catch (error: any) {
    res.status(502).json({ status: 'error', message: error.message ?? 'Supabase health check failed' });
  }
}
