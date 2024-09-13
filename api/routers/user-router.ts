import { Router } from 'express';
import userController from '../controllers/user-controller';
import UserValidator from '../validators/user';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/:cognitoId', UserValidator.findUser, userController.getUserById);
router.post('/', UserValidator.createUser, userController.createUser);

export default router;
