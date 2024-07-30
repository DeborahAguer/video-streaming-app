import { Router } from 'express';
import { authService } from '@middlewares/user-authentication';
import VideoController from '@controllers/video-controller';

const router = Router();

const { fetchVideoById, uploadVideo, searchVideos } = new VideoController();

router.post('/upload', authService.requireAuth, uploadVideo);
router.get('/search', searchVideos);
router.get('/search/:id', fetchVideoById);

export default router;
