import { FolderStatus } from 'src/domain/folder/folder-status.enum';

export class EditProjectDTO {
  name: string;
  type: 'file' | 'folder';
  contents: string;
  fullPath: string;
  folderStatus?: FolderStatus;
  folderLine?: number;
}

export class EditProjectDTO2 {
  name: string;
  type: 'file' | 'folder';
  fullPath: string;
  folderStatus?: FolderStatus;
  modifications?: Modification[];
}

class Modification {
  contents: string;
  folderLine: number;
}
