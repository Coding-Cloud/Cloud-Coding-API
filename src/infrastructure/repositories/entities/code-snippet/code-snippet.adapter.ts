import { CodeSnippetEntity } from './code-snippet.entity';
import { CodeSnippet } from '../../../../domain/code-snippet/code-snippet';

export default class CodeSnippetAdapter {
  static toCodeSnippet(codeSnippet: CodeSnippetEntity): CodeSnippet {
    const { id, projectId, filename, language, startLine, endLine, createdAt } =
      codeSnippet;
    return {
      id,
      projectId,
      filename,
      language,
      startLine,
      endLine,
      createdAt,
    };
  }

  static toCodeSnippetEntity(codeSnippet: CodeSnippet): CodeSnippetEntity {
    return {
      ...codeSnippet,
    };
  }
}
