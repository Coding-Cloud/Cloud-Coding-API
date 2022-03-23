import { PasswordReset } from './password-reset';
import { User } from './user';

export interface PasswordResets {
  createPasswordResets(user: User, token: string): Promise<void>;
  findByUser(user: User): Promise<PasswordReset>;
}
