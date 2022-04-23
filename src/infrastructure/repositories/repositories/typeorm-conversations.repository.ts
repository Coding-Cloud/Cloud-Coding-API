import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversations } from '../../../domain/conversation/conversations.interface';
import { Conversation } from 'src/domain/conversation/conversation';
import ConversationAdapter from '../entities/conversation/conversation.adapter';
import { ConversationEntity } from '../entities/conversation/conversation.entity';

export class TypeormConversationsRepository implements Conversations {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationEntityRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(): Promise<string> {
    try {
      const conversationEntity = this.conversationEntityRepository.create();

      const conversation = await this.conversationEntityRepository.save(
        conversationEntity,
      );
      return conversation.id;
    } catch (error) {
      Logger.error(error);
      if (error.code === '23505') {
        throw new ConflictException('Already member');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findConversationById(id: string): Promise<Conversation> {
    try {
      const conversationEntity =
        await this.conversationEntityRepository.findOne(id);
      return ConversationAdapter.toConversation(conversationEntity);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException();
    }
  }

  async removeConversation(id: string): Promise<void> {
    await this.conversationEntityRepository.delete(id);
  }
}
