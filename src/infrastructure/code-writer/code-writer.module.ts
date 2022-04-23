import { Module } from '@nestjs/common';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { FileCodeWriter } from './file-code-writer';

@Module({
  providers: [{ provide: CodeWriter, useClass: FileCodeWriter }],
  exports: [CodeWriter],
})
export class CodeWriterModule {}
