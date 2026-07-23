import { Router } from 'express';
import { addTask, changeTaskStatus, fetchTasks, removeTask } from '../controllers/taskController.ts';

const router = Router();

router.get('/', fetchTasks);
router.post('/', addTask);
router.patch('/:id', changeTaskStatus);
router.delete('/:id', removeTask);

export default router;
