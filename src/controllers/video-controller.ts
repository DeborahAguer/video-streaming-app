import mongoose from 'mongoose';
import { Request, Response } from 'express';
import { promisify } from 'util';
import VideoService from '@services/video-service';
import MulterUploader from '@middlewares/multer-uploader';
import { ExpressRequest } from '@interfaces/common-interface'

class VideoController {
  private videoService: VideoService;
  private multerUploader: MulterUploader;

  constructor() {
    this.videoService = new VideoService();
    this.multerUploader = new MulterUploader();
  }

  private uploadMiddleware = (): any => {
    return this.multerUploader.singleFile('file');
  }

  public uploadVideo = async (req: ExpressRequest, res: Response) => {
    try {
      const multerUpload = promisify(this.uploadMiddleware());
      await multerUpload(req, {});
      const data = req.body;

      const file = req.file;
      if (!file) {
        throw new Error('No file uploaded');
      }
      const uploadedBy = req.userId;
      const video = await this.videoService.uploadVideo(file, data, uploadedBy);

      res.status(201).json(video);
    } catch (error) {
      res.status(500).send('Error uploading video');
    }
  }

  public fetchVideoById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(id);

      if (!isValidObjectId) {
        throw new Error(`Id not found: ${id}`);
      }
      const video = await this.videoService.fetchVideoById(id);
      if (!video) {
        return res.status(404).json({ error: 'Video not found' });
      }
      res.status(200).json(video);
    } catch (error) {
      res.status(500).send('Error fetching videos');
    }
  }

  public searchVideos = async (req: Request, res: Response) => {
    try {
      const videos = await this.videoService.searchVideos();
      res.status(200).json(videos);
    } catch (error) {
      res.status(500).send('Error fetching videos');
    }
  }
}

export default VideoController;
