import { readFile } from 'fs/promises';
import { EncodeContentFile } from './encode-content-file.interface';

export class Base64EncodeFile implements EncodeContentFile {
  async encode(file: string): Promise<string> {
    // read binary data
    const bitmap = await readFile(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
  }
}
