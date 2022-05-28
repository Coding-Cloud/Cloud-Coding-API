import { Comments } from '../../domain/comment/comments.interface';

export class DeleteProjectCommentUseCase {
  constructor(private comments: Comments) {}

  public deleteProjectCommentUseCase(commentId: string): Promise<void> {
    return this.comments.deleteComment(commentId);
  }
}
