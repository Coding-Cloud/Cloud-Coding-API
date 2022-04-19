export class Asset {
  id: string;
  name: string;
  s3URL: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}
