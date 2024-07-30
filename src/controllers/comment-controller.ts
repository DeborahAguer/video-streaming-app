import { Response } from 'express';
import { ExpressRequest } from '@interfaces/common-interface'
import CommentService from '@services/comment-service';

class CommentController {
  private readonly commentService: CommentService;

  constructor() {
    this.commentService = new CommentService();
  }

  public createComment = async (req: ExpressRequest, res: Response) => {
    try {
      const { text } = req.body;
      const videoId = req.params.videoId;
      const commentBy = req.userId;

      const comment = await this.commentService.createComment(text, videoId, commentBy);

      res.status(201).json(comment);
    } catch (error) {
      res.status(500).send(`Error creating comment, ${error}`);
    }
  }
}

export default CommentController;
