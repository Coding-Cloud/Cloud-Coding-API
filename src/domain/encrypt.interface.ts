export abstract class Encrypt {
  abstract compare(plainText: string, encryptText: string): Promise<boolean>;

  abstract genSaltkey(): Promise<string>;

  abstract hash(plainText: string, saltKey: string): Promise<string>;
}
