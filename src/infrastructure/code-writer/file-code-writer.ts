import { CodeWriter } from 'src/domain/code-writer.abstract';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as rimraf from 'rimraf';
import { IMAGE_EXTENSION } from './image-extension';
import { EncodeContentFile } from './encode-content-file.interface';

export class FileCodeWriter implements CodeWriter {
  constructor(private encodeContentFile: EncodeContentFile) {}
  async readFile(path: string): Promise<string> {
    if (IMAGE_EXTENSION.includes(this.getFileType(path))) {
      try {
        return await this.encodeContentFile.encode(path);
      } catch (error) {}
    } else {
      try {
        return await fs.readFile(path, { encoding: 'utf-8' });
      } catch (error) {}
    }
  }
  async writeInFile(
    path: string,
    modifications: { content: string; lineNumber: number }[],
  ): Promise<void> {
    if (modifications.length === 0) return;
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
  async createImage(content: string, path: string): Promise<void> {
    const bitmap = Buffer.from(content, 'base64');
    await fs.writeFile(path, bitmap);
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
  verifyFileExist(path: string): boolean {
    return fsSync.existsSync(path);
  }

  private getFileType(path: string) {
    return path.split('/').pop()?.split('.').pop();
  }
}
