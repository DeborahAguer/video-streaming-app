import { Router } from 'express';
import { authService } from '@middlewares/user-authentication';
import ReplyController from '@controllers/reply-controller';

const router = Router();

const { createReply, updateReply, deleteReply, getRepliesForComment } = new ReplyController();

router.post('/comment/reply', authService.requireAuth, createReply);
router.get('/comment/:commentId/replies', getRepliesForComment);
router.put('/comment/replies/:replyId', authService.requireAuth, updateReply);
router.delete('/comment/replies/:replyId', authService.requireAuth, deleteReply);

export default router;