export interface Encrypt {
  compare(plainText: string, encryptText: string): boolean;
  genSaltkey(): string;
  hash(plainText: string, saltKey: string): string;
}
