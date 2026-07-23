import { Router } from 'express';
import { addTask, changeTaskStatus, fetchTasks } from '../controllers/taskController.ts';

const router = Router();

router.get('/', fetchTasks);
router.post('/', addTask);
router.patch('/:id', changeTaskStatus);

export default router;
