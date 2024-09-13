import { Router } from 'express';
import ProjectController from '../controllers/project-controller';
import ProjectValidator from '../validators/project';

const router = Router();

router.get('/', ProjectController.getAllProjects);
router.post(
  '/',
  ProjectValidator.createProject,
  ProjectController.createProject
);

export default router;
