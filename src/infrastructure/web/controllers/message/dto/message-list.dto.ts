import { Message } from '../../../../../domain/message/message';

export class MessageListDto {
  messages: Message[];
  totalResults: number;
}
