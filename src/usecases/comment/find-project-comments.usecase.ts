import { Comments } from '../../domain/comment/comments.interface';
import { Comment } from '../../domain/comment/comment';

export class FindProjectCommentsUseCase {
  constructor(private comments: Comments) {}

  public findProjectComments(
    projectId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]> {
    return this.comments.findProjectComments(projectId, search, limit, offset);
  }
}
