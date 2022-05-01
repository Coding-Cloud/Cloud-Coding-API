import { Module } from '@nestjs/common';
import { CodeWriter } from 'src/domain/code-writer.abstract';
import { FileCodeWriter } from './file-code-writer';
import { Base64EncodeFile } from './base64-encode-file';

@Module({
  providers: [
    Base64EncodeFile,
    {
      inject: [Base64EncodeFile],
      provide: CodeWriter,
      useFactory: (encodeContentFile: Base64EncodeFile) =>
        new FileCodeWriter(encodeContentFile),
    },
  ],
  exports: [CodeWriter],
})
export class CodeWriterModule {}
