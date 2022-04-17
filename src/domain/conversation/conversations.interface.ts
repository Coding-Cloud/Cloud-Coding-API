import { Conversation } from './conversation';

export interface Conversations {
  createConversation(): Promise<string>;

  findConversationById(id: string): Promise<Conversation>;

  removeConversation(id: string): Promise<void>;
}
