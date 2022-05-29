import { Comments } from '../../domain/comment/comments.interface';
import { CreateCommentCandidate } from './candidates/create-comment.candidate';

export class AddProjectCommentUseCase {
  constructor(private comments: Comments) {}

  public addProjectCommentUseCase(
    commentCandidate: CreateCommentCandidate,
  ): Promise<string> {
    commentCandidate.createdAt = new Date();
    return this.comments.createComment(commentCandidate);
  }
}
