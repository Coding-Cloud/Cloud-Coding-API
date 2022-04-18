import * as fs from 'fs';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { FolderStatus } from 'src/domain/folder/folder-status.enum';
import { EditProject } from './types/edit-project';

export class EditProjectRunnerUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  async editProject(editsProject: EditProject[]): Promise<void> {
    editsProject.forEach(async (editProject) => {
      console.log(editProject);
      if (
        editProject.folderStatus === FolderStatus.CREATED ||
        editProject.folderStatus === FolderStatus.MODIFIED
      ) {
        if (!fs.existsSync(editProject.fullPath)) {
          this.createProjectElement(editProject);
        }

        if (editProject.type === 'file') {
          console.log('writeInContent -> ' + editProject.fullPath);
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
            console.log('delete folder ' + editProject.fullPath);
            await this.codeWriter.deleteDirectory(editProject.fullPath);
          } catch (error) {}
        } else if (editProject.type === 'file') {
          try {
            console.log('delete file ' + editProject.fullPath);
            await this.codeWriter.deleteFile(editProject.fullPath);
          } catch (error) {}
        }
      }
    });
  }

  private async createProjectElement(editProject: EditProject) {
    if (editProject.type === 'file') {
      console.log(editProject.fullPath);
      console.log("created");
      await this.codeWriter.createFile('', editProject.fullPath);
    } else if (editProject.type === 'folder') {
      await this.codeWriter.createDir(editProject.fullPath);
    }
  }
}
