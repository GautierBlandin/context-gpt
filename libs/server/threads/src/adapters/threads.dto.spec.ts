import { ThreadState } from '../domain/thread.aggregate';
import { convertThreadStateToDto } from './threads.dto';

describe('convertThreadStateToDto', () => {
  it('should correctly convert a ThreadState to ThreadDto', () => {
    const threadState: ThreadState = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date('2023-06-01T12:00:00Z'),
      status: 'WaitingForUserMessage',
      createdBy: 'user123',
      messages: [
        { sender: 'user', content: 'Hello' },
        { sender: 'assistant', content: 'Hi there!' },
      ],
    };

    const result = convertThreadStateToDto(threadState);

    expect(result).toEqual({
      threadId: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: '2023-06-01T12:00:00.000Z',
      createdBy: 'user123',
      messages: [
        { sender: 'User', content: 'Hello' },
        { sender: 'Assistant', content: 'Hi there!' },
      ],
    });
  });

  it('should handle an empty messages array', () => {
    const threadState: ThreadState = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date('2023-06-01T12:00:00Z'),
      status: 'WaitingForUserMessage',
      createdBy: 'user123',
      messages: [],
    };

    const result = convertThreadStateToDto(threadState);

    expect(result.messages).toEqual([]);
  });

  it('should correctly convert createdAt to ISO string', () => {
    const threadState: ThreadState = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      createdAt: new Date('2023-06-01T12:34:56.789Z'),
      status: 'WaitingForUserMessage',
      createdBy: 'user123',
      messages: [],
    };

    const result = convertThreadStateToDto(threadState);

    expect(result.createdAt).toBe('2023-06-01T12:34:56.789Z');
  });
});
