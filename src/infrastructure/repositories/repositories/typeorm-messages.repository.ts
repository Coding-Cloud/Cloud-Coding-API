import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Messages } from '../../../domain/message/messages.interface';
import { MessageEntity } from '../entities/message/message.entity';
import { Message } from '../../../domain/message/message';
import MessageAdapter from '../entities/message/message.adapter';

export class TypeormMessagesRepository implements Messages {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageEntityRepository: Repository<MessageEntity>,
  ) {}

  async createMessage(message: Message): Promise<string> {
    try {
      const messageCreationEntity = this.messageEntityRepository.create({
        ...message,
      });

      const messageEntity = await this.messageEntityRepository.save(
        messageCreationEntity,
      );
      return messageEntity.id;
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByConversation(conversationId: string): Promise<Message[]> {
    try {
      const conversationEntities = await this.messageEntityRepository
        .createQueryBuilder()
        .where('MessageEntity.conversationId=:conversationId', {
          conversationId,
        })
        .getMany();
      return conversationEntities.map((conversationEntity) =>
        MessageAdapter.toMessage(conversationEntity),
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async deleteMessage(id: string): Promise<void> {
    await this.messageEntityRepository.delete(id);
  }
}
