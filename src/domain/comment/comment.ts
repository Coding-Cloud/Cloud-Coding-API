export class Comment {
  id: string;
  ownerId: string;
  postId: string;
  content: string;
  startLine?: number;
  endLine?: number;
  createdAt: Date;
}
