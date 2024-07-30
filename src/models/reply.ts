import mongoose, { Schema, Document, model } from 'mongoose';

export interface ReplyDocument extends Document {
  text: string;
  commentId: mongoose.Types.ObjectId;
  replyBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema = new Schema<ReplyDocument>({
  text: { 
    type: String, 
    required: true 
  },
  commentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment', required: true 
  },
  replyBy: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
}, { timestamps: true });

export default model<ReplyDocument>('Reply', ReplySchema);
