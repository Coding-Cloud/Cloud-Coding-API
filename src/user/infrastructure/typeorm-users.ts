import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credentials.dto';
import { Encrypt } from 'src/auth/encrypt/encrypt.interface';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { Users } from '../users.interface';

@Injectable()
export class typeormUsers extends Repository<UserEntity> implements Users {
  constructor(private encrypt: Encrypt) {
    super();
  }
  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = this.encrypt.genSaltkey();
    const hashedPassword = this.encrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  findBy(props: { id: string; username: string }): Promise<UserEntity> {
    if (props.id) return this.findOne(props.id);
    if (props.username) return this.findOne(props.id);
  }
}
