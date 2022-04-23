import { CodeWriter } from 'src/domain/code-writer.abstract';
import * as fs from 'fs/promises';
import * as rimraf from 'rimraf';

export class FileCodeWriter implements CodeWriter {
  async readFile(path: string): Promise<string> {
    try {
      return await fs.readFile(path, { encoding: 'utf-8' });
    } catch (error) {}
  }
  async writeInFile(
    path: string,
    modifications: { content: string; lineNumber: number }[],
  ): Promise<void> {
    if(modifications.length === 0) return;
    const fileContent = await fs.readFile(path, { encoding: 'utf-8' });
    const fileArray = fileContent.split('\n');
    modifications.forEach((modification) => {
      fileArray[modification.lineNumber - 1] = modification.content;
    });
    const newContent = fileArray.join('\n');
    await fs.writeFile(path, newContent);
  }
  async createDir(path: string): Promise<void> {
    await fs.mkdir(path);
  }
  async createFile(content: string, path: string): Promise<void> {
    await fs.writeFile(path, content);
  }
  async deleteFile(path: string): Promise<void> {
    await fs.unlink(path);
  }
  async deleteDirectory(path: string): Promise<void> {
    await rimraf.sync(path);
  }
  async overwriteAFile(content: string, path: string): Promise<void> {
    await fs.writeFile(path, content);
  }
  async renameFile(oldPath: string, newPath: string): Promise<void> {
    await fs.rename(oldPath, newPath);
  }
}
