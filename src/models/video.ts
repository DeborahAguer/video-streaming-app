import { Schema, model, Document, Types } from 'mongoose';

export enum VideoStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export interface VideoDocument extends Document {
  title: string;
  description: string;
  tags: string[];
  uploadedBy: Types.ObjectId;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  status: VideoStatus;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema<VideoDocument>({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  tags: [{ 
    type: String 
  }],
  uploadedBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  videoUrl: { 
    type: String, 
    required: true 
  },
  thumbnailUrl: { 
    type: String, 
    // required: true 
  },
  views: { 
    type: Number, 
    default: 0 
  },
  status: { 
    type: String, 
    enum: Object.values(VideoStatus), 
    default: VideoStatus.PENDING 
  },
}, { timestamps: true });

VideoSchema.index({ title: 'text' }); // for full-text and partial-text search

export default model<VideoDocument>('Video', VideoSchema);
