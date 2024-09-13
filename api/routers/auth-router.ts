import { Router } from 'express';
import authController from '../controllers/auth-controller';
import authValidator from '../validators/auth';

const router = Router();

router.post('/login', authValidator.register, authController.login);
router.post('/register', authValidator.register, authController.register);

export default router;
