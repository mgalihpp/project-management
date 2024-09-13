import { Router } from 'express';
import teamController from '../controllers/team-controller';

const router = Router();

router.get('/', teamController.getTeams);

export default router;
