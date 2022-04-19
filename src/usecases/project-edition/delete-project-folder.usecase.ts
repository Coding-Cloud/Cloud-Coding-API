
import * as fs from 'fs';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { DeleteFolder } from './types/delete-folder';
import { RenameFolder } from './types/rename-folder';

export class DeleteProjectFolderRunnerUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  async deleteProjectFolder(deleteFolder: DeleteFolder): Promise<void> {
      if(deleteFolder.type === 'file') {
        await this.codeWriter.deleteFile(deleteFolder.path);
      }else if(deleteFolder.type === 'dir') {
        console.log("on passe bien ici");
        console.log(deleteFolder.path);
        await this.codeWriter.deleteDirectory(deleteFolder.path);
      }
  }
}
