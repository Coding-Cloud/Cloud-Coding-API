import { Comments } from '../../domain/comment/comments.interface';
import { Comment } from '../../domain/comment/comment';

export class FindCommentUseCase {
  constructor(private comments: Comments) {}

  public async getById(id: string): Promise<Comment> {
    return this.comments.findCommentById(id);
  }
}
