import multer from 'multer';

const videoExtensions: string[] = [
  '.mp4',
  '.mov',
  '.avi',
  '.mkv',
  '.wmv',
  '.flv',
  '.webm',
  '.mpeg',
  '.3gp',
  '.mpg'
];

class MulterUploader {
  private upload: multer.Multer;

  constructor() {
    this.upload = multer({
      storage: multer.memoryStorage(),
      limits: {
        fileSize: 1024 * 1024 * 1000
      },
      fileFilter: (req, file, cb) => {
        if (file && this.isVideoFile(file)) {
          cb(null, true);
        } else {
          cb(new Error('Only video files are allowed'));
        }
      }
    });
  }

  private isVideoFile = (file: Express.Multer.File) => {
    return videoExtensions.some(ext => file.originalname.endsWith(ext));
  };

  public singleFile(fieldName: string) {
    return this.upload.single(fieldName);
  }

  public multipleFiles(fieldName: string, maxCount: number) {
    return this.upload.array(fieldName, maxCount);
  }
}

export default MulterUploader;
