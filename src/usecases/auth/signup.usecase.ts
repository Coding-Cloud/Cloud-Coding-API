import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';
import { Users } from '../../domain/user/users.interface';

export class SignUpUseCases {
  constructor(private readonly users: Users) {}

  async signUp(createUserDTO: CreateUserDTO): Promise<void> {
    return this.users.createUser(createUserDTO);
  }
}
