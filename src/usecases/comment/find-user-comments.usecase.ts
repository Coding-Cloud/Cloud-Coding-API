import { Comments } from '../../domain/comment/comments.interface';
import { Comment } from '../../domain/comment/comment';

export class FindUserPublicCommentsUseCase {
  constructor(private comments: Comments) {}

  public findUserPublicComments(
    userId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]> {
    return this.comments.findUserPublicComments(userId, search, limit, offset);
  }
}
