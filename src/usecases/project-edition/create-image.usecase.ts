import { CodeWriter } from 'src/domain/code-writer.abstract';

export class CreateImageUseCase {
  constructor(private readonly codeWriter: CodeWriter) {}

  async createImage(content: string, path: string): Promise<void> {
    this.codeWriter.createImage(content, path);
  }
}
