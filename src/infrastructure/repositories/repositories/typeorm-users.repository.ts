import {
  ConflictException,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Encrypt } from '../../../domain/encrypt.interface';
import { UserEntity } from '../entities/user/user.entity';
import { Users } from '../../../domain/user/users.interface';
import { User } from 'src/domain/user/user';
import UserAdapter from 'src/infrastructure/repositories/entities/user/user.adapter';
import { CreateUserDTO } from 'src/infrastructure/web/controllers/auth/dto/create-user.dto';

export class TypeormUsersRespository implements Users {
  constructor(
    @Inject(Encrypt) private encrypt: Encrypt,
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDTO: CreateUserDTO): Promise<void> {
    const { username, password, email } = createUserDTO;

    const salt = await this.encrypt.genSaltkey();
    const hashedPassword = await this.encrypt.hash(password, salt);

    const user = this.userEntityRepository.create({
      username,
      password: hashedPassword,
      email,
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

  async findBy(props: {
    id?: string;
    username?: string;
    email?: string;
  }): Promise<User> {
    const { id, username, email } = props;
    if (id) {
      const userEntity = await this.userEntityRepository.findOne(id);
      return UserAdapter.toUser(userEntity);
    }
    if (username) {
      const userEntity = await this.userEntityRepository.findOne({
        where: { username },
      });
      return UserAdapter.toUser(userEntity);
    }

    if (email) {
      const userEntity = await this.userEntityRepository.findOne({
        where: { email },
      });
      return UserAdapter.toUser(userEntity);
    }
  }

  async changePassword(user: User, password: string): Promise<void> {
    const userEntity = UserAdapter.toUserEntity(user);
    await this.userEntityRepository.update({ id: userEntity.id }, { password });
  }

  async findUserByResetPassword(token: string): Promise<User> {
    const userEntity: UserEntity = await this.userEntityRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(
        'password_reset',
        'password_reset',
        'password_reset.userId = user.id',
      )
      .where('password_reset.token = :token', { token })
      .getOne();
    return userEntity ? UserAdapter.toUser(userEntity) : null;
  }
}
