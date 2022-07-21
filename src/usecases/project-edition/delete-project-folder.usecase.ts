import { CodeWriter } from 'src/domain/code-writer.abstract';
import { DeleteFolder } from './types/delete-folder';

export class DeleteProjectFolderRunnerUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  async deleteProjectFolder(deleteFolder: DeleteFolder): Promise<void> {
    if (deleteFolder.type === 'file') {
      await this.codeWriter.deleteFile(deleteFolder.path);
    } else if (deleteFolder.type === 'dir') {
      await this.codeWriter.deleteDirectory(deleteFolder.path);
    }
  }
}
