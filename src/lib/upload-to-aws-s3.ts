import { S3, CloudFront } from 'aws-sdk';
import ffmpeg from 'fluent-ffmpeg'
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import appEnv from '@utils/appEnv';

ffmpeg.setFfmpegPath(ffmpegPath);

class UploadVideosToS3 {
  private s3: S3;
  private cloudfront: CloudFront

  constructor() {
    this.s3 = new S3({
      accessKeyId: appEnv('AWS_ACCESS_KEY'),
      secretAccessKey: appEnv('AWS_SECRET_KEY'),
    });

    this.cloudfront = new CloudFront({
      accessKeyId: appEnv('AWS_ACCESS_KEY'),
      secretAccessKey: appEnv('AWS_SECRET_KEY'),
    });
  }

  async uploadVideo(file: Express.Multer.File): Promise<string> {
    const key = `${'videoStream'}/${file.originalname}`;
    try {
      const params = {
        Bucket: appEnv('S3_BUCKET'),
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'private',
      };

      await this.s3.upload(params).promise();
      const domain = await this.getCloudFrontDomain();
      console.log('Video uploaded successfully');
      const videoUrl = `https://${domain}/${key}`

      return videoUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  public getCloudFrontDomain = async () => {
    try {
      const distributions = await this.cloudfront.listDistributions().promise();
      if (distributions.DistributionList && distributions.DistributionList.Items.length > 0) {
        const distribution = distributions.DistributionList.Items[0];
        return distribution.DomainName;
      } else {
        console.log('No CloudFront distributions found.');
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  private captureVideoThumbnail (videoPath: string, bucket: string, buffer: any, key: string, timestamp: any) {
    const thumbnailOutputPath = '/tmp/thumbnail.png';
    return new Promise((resolve, reject) => {

      const command = ffmpeg(videoPath)
      .seekInput(timestamp)
      .frames(1)
      .toFormat('image2')
      .outputOptions('-vf', 'scale=120:-1')

      command.on('error', (err) => {
        reject(err);
      });

      command.on('end', async() => {
        try {
          await this.uploadImage(bucket, key, buffer);
          resolve(`Thumbnail uploaded to S3: ${bucket}/${key}`);
        } catch (error) {
          reject(error);
        }
      })

      command.run();
    });
  };

  private uploadImage (bucket: string, s3Key: string, buffer: any) {
    return new Promise((resolve, reject) => {
      this.s3.putObject({
        Bucket: bucket,
        Key: s3Key,
        Body: buffer,
        ContentType: 'image/jpeg'
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

export default UploadVideosToS3;
