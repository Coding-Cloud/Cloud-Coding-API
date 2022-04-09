import { Projects } from '../../domain/project/projects.interface';
import { Folder } from 'src/domain/folder/folder.interface';
import * as fs from 'fs/promises';
import { resolve } from 'path';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { ReadProject } from './read-project';

export class ReadProjectUseCase {
  private FILES_NOT_INCLUDE = ['favicon.ico'];

  constructor(private readonly codeWriter: CodeWriter) {}

  async readProject(readProject: ReadProject): Promise<{
    appFiles: { [key: string]: Folder };
  }> {
    const dir = `${readProject.path}/src`;
    const files = await this.getFiles(dir);
    const project: { appFiles: { [key: string]: Folder } } = { appFiles: {} };
    const filesFlatten: any[] = [];
    this.arrayToFlat(filesFlatten, files);
    //console.log(filesFlatten);

    for (const file of filesFlatten) {
      if (file === undefined) continue;

      project.appFiles[file.res] = {
        name: file.name,
        type: file.type,
        contents:
          file?.type === 'file'
            ? (await this.codeWriter.readFile(file.res)) ?? ''
            : '',
        fullPath: file.res,
        lastModified: Date.now(),
      };
    }

    return project;
  }

  private arrayToFlat = (arraySource: any[], files: any[]): any => {
    if (Array.isArray(files)) {
      for (const file of files) {
        this.arrayToFlat(arraySource, file);
      }
    }
    if (!Array.isArray(files)) arraySource.push(files);
  };

  private getFiles = async (dir: string): Promise<any[]> => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(async (dirent) => {
        const res = resolve(dir, dirent.name);
        if (this.FILES_NOT_INCLUDE.includes(dirent.name)) {
          return;
        }
        return dirent.isDirectory()
          ? [
              { name: dirent.name, res, type: 'folder' },
              await this.getFiles(res),
            ]
          : { name: dirent.name, res, type: 'file' };
      }),
    );
    return Array.prototype.concat(...files);
  };
}
