import { Router } from 'express';
import UserController from '@controllers/auth-controller';

const router = Router();

const { createUser, login, getMe, me } = UserController

router.post('/register', createUser);
router.post('/login', login);
router.get('/me', me);

export default router;
