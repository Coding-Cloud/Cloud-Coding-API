import { DeleteFolderResource } from '../resource/delete-folder.dto';

export interface BroadcastDeleteFolderDto {
  event: string;
  deleteFolderResource: DeleteFolderResource;
  socket: string;
  room: string;
}
