import { CodeWriter } from 'src/domain/code-writer.abstract';
import { RenameFolder } from './types/rename-folder';

export class RenameProjectRunnerUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  async renameProjectFolder(renameFolder: RenameFolder): Promise<void> {
    await this.codeWriter.renameFile(
      renameFolder.oldName,
      renameFolder.newName,
    );
  }
}
