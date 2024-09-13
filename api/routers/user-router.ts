import { Router } from 'express';
import userController from '../controllers/user-controller';
import userValidator from '../validators/user';
import { authenticated } from '../middleware/auth';

const router = Router();

router.get('/', authenticated, userController.getUser);
// router.get('/', userController.getAllUsers);
router.get('/:userId', userValidator.findUser, userController.getUserById);
router.put('/', userValidator.createUser, userController.updateUser);

export default router;
