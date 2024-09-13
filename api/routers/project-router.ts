import { Router } from 'express';
import projectController from '../controllers/project-controller';
import projectValidator from '../validators/project';

const router = Router();

router.get('/', projectController.getAllProjects);
router.post(
  '/',
  projectValidator.createProject,
  projectController.createProject
);

export default router;
