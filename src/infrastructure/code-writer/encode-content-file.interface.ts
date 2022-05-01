export interface EncodeContentFile {
  encode(file: string): Promise<string>;
}

import { readFile } from 'fs/promises';

// function to encode file data to base64 encoded string
export async function base64_encode(file: string): Promise<string> {
  // read binary data
  const bitmap = await readFile(file);
  // convert binary data to base64 encoded string
  return Buffer.from(bitmap).toString('base64');
}

