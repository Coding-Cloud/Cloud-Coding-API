export abstract class CodeWriter {
  abstract writeInFile(
    path: string,
    modifications: { content: string; lineNumber: number }[],
  ): Promise<void>;
  abstract createFile(content: string, path: string): Promise<void>;
  abstract createDir(path: string): Promise<void>;
  abstract deleteFile(path: string): Promise<void>;
  abstract deleteDirectory(path: string): Promise<void>;
  abstract overwriteAFile(content: string, path: string): Promise<void>;
  abstract readFile(path: string): Promise<string | undefined>;
  abstract renameFile(oldPath: string, newPath: string): Promise<void>;
  abstract verifyFileExist(path: string): boolean;
}
