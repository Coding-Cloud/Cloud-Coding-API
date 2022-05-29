import { Comment } from '../../../../../domain/comment/comment';

export class CommentListDto {
  comments: Comment[];
  totalResults: number;
}
