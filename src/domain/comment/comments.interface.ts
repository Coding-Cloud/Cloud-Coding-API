import { Comment } from './comment';
import { CreateCommentCandidate } from '../../usecases/comment/candidates/create-comment.candidate';

export interface Comments {
  findProjectComments(projectId: string): Promise<Comment[]>;

  createComment(createCommentDTO: CreateCommentCandidate): Promise<string>;

  deleteComment(commentId: string): Promise<void>;
}
