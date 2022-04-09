import { FolderStatus } from './folder-status.enum';

export interface Folder {
  name: string;
  type: 'file' | 'folder';
  contents: string;
  fullPath: string;
  lastModified: number;
  folderStatus?: FolderStatus;
}
