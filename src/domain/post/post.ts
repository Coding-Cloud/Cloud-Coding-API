export class Post {
  id: string;
  ownerId: string;
  groupId?: string;
  content: string;
  codeSnippetId: string;
  createdAt: Date;
}
