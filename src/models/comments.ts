import { Schema, model, Document, Types } from 'mongoose';

export interface CommentDocument extends Document {
  text: string;
  videoId: Types.ObjectId;
  commentBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>({
  text: { 
    type: String, 
    required: true 
  },
  videoId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Video', 
    required: true 
  },
  commentBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    // required: true 
  },
}, { timestamps: true });

export default model<CommentDocument>('Comment', CommentSchema);
