import { Router } from 'express';
import searchController from '../controllers/search-controller';
import searchValidator from '../validators/search';

const router = Router();

router.get('/', searchValidator.search, searchController.search);

export default router;
