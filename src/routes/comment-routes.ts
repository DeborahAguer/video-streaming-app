import { Router } from 'express';
import { authService } from '@middlewares/user-authentication';
import CommentController from '@controllers/comment-controller';

const router = Router();

const { createComment} = new CommentController();

router.post('/:videoId/comments', authService.requireAuth, createComment);

export default router;
