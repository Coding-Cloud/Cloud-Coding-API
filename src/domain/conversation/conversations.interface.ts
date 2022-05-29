import { Conversation } from './conversation';
import { CreateConversationCandidate } from '../../usecases/conversation/candidates/create-conversation.candidate';

export interface Conversations {
  createConversation(ownership: CreateConversationCandidate): Promise<string>;

  findConversationById(id: string): Promise<Conversation>;

  findUserConversationById(
    id: string,
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<Conversation[]>;

  removeConversationByGroupId(groupId: string): Promise<void>;

  removeConversationByFriendshipId(friendshipId: string): Promise<void>;
}
