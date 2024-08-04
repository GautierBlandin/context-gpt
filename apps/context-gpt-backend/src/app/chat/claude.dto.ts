import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MessageDto {
  @IsNotEmpty()
  sender: UserRole;

  @IsNotEmpty()
  content: string;
}

export class ClaudeRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageDto)
  messages: MessageDto[];
}

enum UserRole {
  User = 'User',
  Assistant = 'Assistant',
}
