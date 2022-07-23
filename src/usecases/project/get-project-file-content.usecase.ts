import { CodeWriter } from 'src/domain/code-writer.abstract';
import { NotFoundException } from '@nestjs/common';

export class GetProjectFileContentUseCase {
  private FILES_NOT_INCLUDE = [
    '.angular',
    '.git',
    'node_modules',
    '.pnpm-store',
    'dist',
  ];

  constructor(private readonly codeWriter: CodeWriter) {}

  async readFile(
    projectId: string,
    path: string,
  ): Promise<{ content: string }> {
    try {
      const fileContent = await this.codeWriter.readFile(
        `${process.env.BASE_PATH_PROJECT}/${projectId}/${path}`,
      );

      return { content: fileContent };
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
