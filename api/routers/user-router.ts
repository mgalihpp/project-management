import { Router } from 'express';
import userController from '../controllers/user-controller';
import userValidator from '../validators/user';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:cognitoId', userValidator.findUser, userController.getUserById);
router.post('/', userValidator.createUser, userController.createUser);

export default router;
