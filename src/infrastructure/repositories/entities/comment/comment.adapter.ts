import { CommentEntity } from './comment.entity';
import { Comment } from '../../../../domain/comment/comment';

export default class CommentAdapter {
  static toComment(comment: CommentEntity): Comment {
    const { id, ownerId, content, projectId, createdAt } = comment;
    return {
      id,
      ownerId,
      content,
      projectId,
      createdAt,
    };
  }

  static toCommentEntity(comment: Comment): CommentEntity {
    return {
      ...comment,
    };
  }
}
