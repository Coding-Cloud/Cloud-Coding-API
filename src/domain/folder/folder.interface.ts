import { FolderStatus } from './folder-status.enum';

export interface Folder {
  name: string;
  type: 'file' | 'folder';
  contents: string | null;
  fullPath: string;
  lastModified: number;
  folderStatus?: FolderStatus;
}
