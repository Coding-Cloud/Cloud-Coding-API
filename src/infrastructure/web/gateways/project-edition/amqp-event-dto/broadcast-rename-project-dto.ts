import { RenameFolderResource } from '../resource/rename-folder-resource';

export interface BroadcastRenameProjectDto {
  event: string;
  renameFolderResource: RenameFolderResource;
  socket: string;
  room: string;
}
