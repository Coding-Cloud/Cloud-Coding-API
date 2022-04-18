import { FolderStatus } from 'src/domain/folder/folder-status.enum';


export class EditProject {
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
