import { ThreadsRepository } from '../ports/threads.repository';
import { ThreadAggregate } from '../domain/thread.aggregate';
import { err, Result, success } from '@context-gpt/errors';
import { DomainError, InfrastructureError } from '@context-gpt/server-shared-errors';
import { Inject } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Message } from '../domain/Message';

export class PrismaThreadsRepository extends ThreadsRepository {
  constructor(@Inject() private readonly prismaService: PrismaService) {
    super();
  }

  async save(thread: ThreadAggregate): Promise<Result<void, InfrastructureError>> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        await prisma.thread.upsert({
          where: { id: thread.state.id },
          update: {
            status: thread.state.status,
            createdBy: thread.state.createdBy,
          },
          create: {
            id: thread.state.id,
            createdAt: thread.state.createdAt,
            status: thread.state.status,
            createdBy: thread.state.createdBy,
          },
        });

        // Save messages
        for (const message of thread.state.messages) {
          await prisma.message.create({
            data: {
              threadId: thread.state.id,
              sender: message.sender,
              content: message.content,
            },
          });
        }
      });

      return success(undefined);
    } catch (error) {
      return err(new InfrastructureError(`Failed to save thread`));
    }
  }

  async get(id: string): Promise<Result<ThreadAggregate, InfrastructureError | ThreadNotFoundError>> {
    try {
      const thread = await this.prismaService.thread.findUnique({
        where: { id },
        include: { messages: true },
      });

      if (!thread) {
        return err(new ThreadNotFoundError(`Thread with id ${id} not found`));
      }

      const messages: Message[] = thread.messages.map((m) => ({
        sender: m.sender,
        content: m.content,
      }));

      return success(
        ThreadAggregate.from({
          id: thread.id,
          createdAt: thread.createdAt,
          status: thread.status as 'WaitingForUserMessage',
          createdBy: thread.createdBy,
          messages,
        }),
      );
    } catch (error) {
      return err(new InfrastructureError(`Failed to get thread`));
    }
  }

  async listForUser(userId: string): Promise<Result<ThreadAggregate[], InfrastructureError>> {
    try {
      const threads = await this.prismaService.thread.findMany({
        where: { createdBy: userId },
        include: { messages: true },
      });

      const threadAggregates = threads.map((thread) =>
        ThreadAggregate.from({
          id: thread.id,
          createdAt: thread.createdAt,
          status: thread.status as 'WaitingForUserMessage',
          createdBy: thread.createdBy,
          messages: thread.messages.map((m) => ({
            sender: m.sender,
            content: m.content,
          })),
        }),
      );

      return success(threadAggregates);
    } catch (error) {
      return err(new InfrastructureError(`Failed to list threads for user`));
    }
  }
}

export class ThreadNotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ThreadNotFoundError';
  }
}
