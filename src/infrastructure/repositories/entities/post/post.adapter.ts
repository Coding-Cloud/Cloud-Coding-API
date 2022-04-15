import { PostEntity } from './post.entity';
import { Post } from '../../../../domain/post/post';

export default class PostAdapter {
  static toPost(post: PostEntity): Post {
    const { id, ownerId, groupId, content, codeSnippetId, createdAt } = post;
    return {
      id,
      ownerId,
      groupId,
      content,
      codeSnippetId,
      createdAt,
    };
  }

  static toPostEntity(post: Post): PostEntity {
    return {
      ...post,
    };
  }
}
