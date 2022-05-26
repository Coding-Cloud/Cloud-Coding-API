import { Comment } from './comment';
import { CreateCommentCandidate } from '../../usecases/comment/candidates/create-comment.candidate';

export interface Comments {
  findCommentById(id: string): Promise<Comment>;

  createComment(
    createCommentCandidate: CreateCommentCandidate,
  ): Promise<string>;

  findProjectComments(
    projectId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]>;

  findUserPublicComments(
    userId: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<[Comment[], number]>;

  deleteComment(commentId: string): Promise<void>;
}
