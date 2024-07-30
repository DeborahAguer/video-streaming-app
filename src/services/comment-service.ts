import Comment, { CommentDocument } from '@models/comments';
import { Model } from 'mongoose';

class CommentService {
  private readonly comment: Model<CommentDocument>;

  constructor() {
    this.comment = Comment;
  }

  public async createComment(text: string, videoId: string, commentBy: string): Promise<CommentDocument> {
    try {
      const comment = await this.comment.create({ text, videoId, commentBy });
      return comment;
    } catch (error) {
      throw new Error(`Unable to create comment: ${error}`);
    }
  }
}

export default CommentService;
