import { Router } from 'express';
import taskController from '../controllers/task-controller';
import taskValidator from '../validators/task';

const router = Router();

router.get('/', taskValidator.getTask, taskController.getTask);
router.get(
  '/user/:userId',
  taskValidator.getUserTasks,
  taskController.getUserTasks
);
router.post('/', taskValidator.createTask, taskController.createTask);
router.patch(
  '/:taskId/status',
  taskValidator.updateTask,
  taskController.updateTask
);

export default router;
