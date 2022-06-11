import { EditProjectDTO } from '../dto/edit-project.dto';

export interface BroadcastEditProjectDto {
  event: string;
  editsProject: EditProjectDTO[];
  socket: string;
  room: string;
}
