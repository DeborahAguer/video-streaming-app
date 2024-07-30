import { Model } from 'mongoose';
import Reply, { ReplyDocument } from '@models/reply';
import Comment, { CommentDocument } from '@models/comments';
import {ReplyInput } from '@interfaces/reply-interface'

class ReplyService {

  private readonly reply: Model<ReplyDocument>;
  private readonly comment: Model<CommentDocument>;

  constructor() {
    this.reply = Reply;
    this.comment = Comment;
  }

  public async createReply(reply: ReplyInput): Promise<ReplyDocument> {
    const { text, commentId, replyBy } = reply;
    try {
      const comment = await this.comment.findOne({ _id: commentId});
    
      if (!comment) {
       throw new Error(`Comment does not exist`)
      }

      const reply = await this.reply.create({ text, commentId, replyBy });
      return reply;
    } catch (error) {
      throw new Error(`Error creating reply: ${error}`);
    }
  }

  public async getRepliesForComment(commentId: string): Promise<ReplyDocument[]> {
    try {
      const replies = await this.reply.find({ commentId }).exec();
      return replies;
    } catch (error) {
      throw new Error(`Error getting replies for comment: ${error}`);
    }
  }

  public async updateReply(replyId: string, newText: string): Promise<ReplyDocument | null> {
    try {
      const updatedReply = await this.reply.findByIdAndUpdate(replyId, { text: newText }, { new: true }).exec();
      return updatedReply;
    } catch (error) {
      throw new Error(`Error updating reply: ${error}`);
    }
  }

  public async deleteReply(replyId: string): Promise<void> {
    try {
      await this.reply.findByIdAndDelete(replyId).exec();
    } catch (error) {
      throw new Error(`Error deleting reply: ${error}`);
    }
  }
}

export default ReplyService;
