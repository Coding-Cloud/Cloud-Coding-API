import { Comments } from '../../domain/comment/comments.interface';
import { UpdateCommentCandidate } from './candidates/update-comment.candidate';

export class UpdateCommentUseCase {
  constructor(private comments: Comments) {}

  public async updateComment(
    commentId: string,
    commentCandidate: UpdateCommentCandidate,
  ): Promise<void> {
    await this.comments.updateComment(commentId, commentCandidate);
  }
}
