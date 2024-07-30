import mongoose from 'mongoose';
import Video, { VideoDocument } from '@models/video';
import UploadVideosToS3 from '@lib/upload-to-aws-s3';
import MulterUploader from '@middlewares/multer-uploader';
import { VideoInput } from '@interfaces/video-interface'

interface QueryOptions {
  videoId?: string;
  title?: string;
  user?: string;
  status?: string;
}

interface AggregationPipelineStage {
  $match: {
    _id: mongoose.Types.ObjectId;
  };
}

type AggregationPipeline = (AggregationPipelineStage | any)[];

class VideoService {
  private uploadToS3: UploadVideosToS3;
  private multerUploader: MulterUploader;

  constructor() {
    this.uploadToS3 = new UploadVideosToS3();
    this.multerUploader = new MulterUploader();
  }
  public uploadVideo = async (file: any, videoData: VideoInput, uploadedBy: string): Promise<VideoDocument> => {
    try {
      const videoUrl = await this.uploadToS3.uploadVideo(file);
      const video = await Video.create({ ...videoData, uploadedBy, videoUrl });
      return video;
    } catch (error) {
      throw new Error(`Unable to create video: ${error}`);
    }
  }

  public fetchVideoById = async (id: any): Promise<VideoDocument | null> => {
    try {
      const pipeline: AggregationPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: 'comments',
            let: { videoId: '$_id' },
            pipeline: [
              {
                $match: { $expr: { $eq: ['$videoId', '$$videoId'] } }
              },
              {
                $sort: { createdAt: -1 }
              }
            ],
            as: 'comments'
          }
        },
        {
          $addFields: {
            commentsCount: { $size: '$comments' }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            videoUrl: 1,
            description: 1,
            uploadedBy: 1,
            thumbnailUrl: 1,
            comments: 1,
            commentsCount: 1
          }
        }
      ];

      const videoWithComments: VideoDocument[] = await Video.aggregate(pipeline).exec();

      if (videoWithComments.length > 0) {
        return videoWithComments[0];
      } else {
        return null;
      }
    } catch (error) {
      throw new Error(`Unable to find video by ID: ${error}`);
    }
  }

  public async searchVideos(query?: string, options?: QueryOptions): Promise<VideoDocument[]> {
    try {
      const filter: any = {}; 

      if (options) {
        if (options.user) filter.user = options.user;
        if (options.status) filter.status = options.status;
      }

      const regex = { $regex: query, $options: 'i' };
      if (query) {
        const videos = await Video.find({
          $or: [
            { title: { $regex: regex } },
            { description: { $regex: regex } }
          ],
          ...filter
        });
        return videos;
      } else {
        const videos = await Video.find(filter);
        return videos;
      }
    } catch (error) {
      throw new Error(`Unable to search videos: ${error}`);
    }
  }
  public async update(id: string, videoData: Partial<VideoDocument>): Promise<VideoDocument | null> {
    try {
      const video = await Video.findByIdAndUpdate(id, videoData, { new: true });
      return video;
    } catch (error) {
      throw new Error(`Unable to update video: ${error}`);
    }
  }

  public async delete(id: string): Promise<boolean> {
    try {
      await Video.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new Error(`Unable to delete video: ${error}`);
    }
  }
}

export default VideoService;
