import { IsNotEmpty, IsUUID } from 'class-validator';
import { ThreadState } from '../domain/thread.aggregate';

class MessageDto {
  @IsNotEmpty()
  sender: UserRole;

  @IsNotEmpty()
  content: string;
}

export class ThreadsIdMessagesRequestPostDto {
  message: string;
}

export class ThreadDto {
  @IsUUID()
  threadId: string;
  createdAt: string;
  createdBy: string;
  messages: MessageDto[];
}

export class CreateThreadResponseDto extends ThreadDto {}

enum UserRole {
  User = 'User',
  Assistant = 'Assistant',
}

export function convertThreadStateToDto(threadState: ThreadState): ThreadDto {
  return {
    threadId: threadState.id,
    createdAt: threadState.createdAt.toISOString(),
    createdBy: threadState.createdBy,
    messages: threadState.messages.map((message) => ({
      sender: message.sender === 'user' ? UserRole.User : UserRole.Assistant,
      content: message.content,
    })),
  };
}
