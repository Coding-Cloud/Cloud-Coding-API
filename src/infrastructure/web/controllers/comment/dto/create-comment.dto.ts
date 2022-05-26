import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;
  @IsNotEmpty()
  content: string;
}
