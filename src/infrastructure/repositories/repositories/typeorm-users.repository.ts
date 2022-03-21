import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from '../../controllers/auth/dto/auth-credentials.dto';
import { Encrypt } from '../../../domain/encrypt.interface';
import { UserEntity } from '../../entities/user.entity';
import { Users } from '../../../domain/user/users.interface';

@Injectable()
export class TypeormUsersRespository implements Users {
  constructor(
    @Inject(Encrypt) private encrypt: Encrypt,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await this.encrypt.genSaltkey();
    const hashedPassword = await this.encrypt.hash(password, salt);

    const user = this.userEntityRepository.create({
      username,
      password: hashedPassword,
    });

    try {
      await this.userEntityRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  findBy(props: { id: string; username: string }): Promise<UserEntity> {
    if (props.id) return this.userEntityRepository.findOne(props.id);
    if (props.username) return this.userEntityRepository.findOne(props.id);
  }
}
