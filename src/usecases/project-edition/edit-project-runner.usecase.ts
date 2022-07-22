import * as fs from 'fs';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { FolderStatus } from 'src/domain/folder/folder-status.enum';
import { EditProject } from './types/edit-project';
import { Logger } from '@nestjs/common';

export class EditProjectRunnerUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  editProject(editsProject: EditProject[]): void {
    editsProject.forEach(async (editProject) => {
      if (
        editProject.folderStatus === FolderStatus.CREATED ||
        editProject.folderStatus === FolderStatus.MODIFIED
      ) {
        if (!fs.existsSync(editProject.fullPath)) {
          this.createProjectElement(editProject).then();
        }

        if (editProject.type === 'file') {
          const modifications = editProject.modifications.map(
            (modification) => ({
              content: modification.contents,
              lineNumber: modification.folderLine,
            }),
          );
          await this.codeWriter.writeInFile(
            editProject.fullPath,
            modifications,
          );
        }
      } else if (editProject.folderStatus === FolderStatus.DELETED) {
        if (editProject.type === 'folder') {
          try {
            await this.codeWriter.deleteDirectory(editProject.fullPath);
          } catch (error) {}
        } else if (editProject.type === 'file') {
          try {
            await this.codeWriter.deleteFile(editProject.fullPath);
          } catch (error) {}
        }
      }
    });
  }

  private async createProjectElement(editProject: EditProject) {
    if (editProject.type === 'file') {
      Logger.debug('Created file ' + editProject.fullPath);
      await this.codeWriter.createFile('', editProject.fullPath);
    } else if (editProject.type === 'folder') {
      Logger.debug('Created folder ' + editProject.fullPath);
      await this.codeWriter.createDir(editProject.fullPath);
    }
  }
}
