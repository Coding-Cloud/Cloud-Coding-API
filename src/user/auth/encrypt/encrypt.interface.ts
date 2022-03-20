export interface Encrypt {
  compare(plainText: string, encryptText: string): Promise<boolean>;
  genSaltkey(): Promise<string>;
  hash(plainText: string, saltKey: string): Promise<string>;
}
