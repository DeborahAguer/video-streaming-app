import { Request, Response } from 'express';
import ReplyService from '@services/reply-service';
import { ExpressRequest } from '@interfaces/common-interface'

class RepliesController {
  private readonly replyService: ReplyService;

  constructor() {
    this.replyService = new ReplyService();
  }

  public createReply = async (req: ExpressRequest, res: Response): Promise<void> => {
    try {
      const replyBy = req.userId
      const reply = await this.replyService.createReply({ ...req.body, replyBy });
      res.status(201).json(reply);
    } catch (error) {
      console.error('Error creating reply:', error);
      res.status(500).send(`Error creating reply, ${error}`);
    }
  }

  public getRepliesForComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { commentId } = req.params;
      const replies = await this.replyService.getRepliesForComment(commentId);
      res.json(replies);
    } catch (error) {
      res.status(500).send('Error getting replies for comment');
    }
  }

  public updateReply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { replyId } = req.params;
      const { newText } = req.body;
      const updatedReply = await this.replyService.updateReply(replyId, newText);
      if (updatedReply) {
        res.json(updatedReply);
      } else {
        res.status(404).send('Reply not found');
      }
    } catch (error) {
      res.status(500).send('Error updating reply');
    }
  }

  public deleteReply = async (req: Request, res: Response): Promise<void> => {
    try {
      const { replyId } = req.params;
      await this.replyService.deleteReply(replyId);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).send('Error deleting reply');
    }
  }
}

export default RepliesController;
