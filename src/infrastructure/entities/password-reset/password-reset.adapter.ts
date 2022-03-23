import { PasswordReset } from 'src/domain/user/password-reset';
import { PasswordResetEntity } from './password-reset.entity';

export default class PasswordResetAdapter {
  static toPasswordReset(
    passwordResetEntity: PasswordResetEntity,
  ): PasswordReset {
    const { id, token } = passwordResetEntity;
    return {
      id,
      token,
    };
  }
}
