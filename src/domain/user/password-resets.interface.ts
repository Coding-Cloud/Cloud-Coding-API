import { User } from './user';

export interface PasswordResets {
  createPasswordResets(user: User, token: string): Promise<void>;
}
