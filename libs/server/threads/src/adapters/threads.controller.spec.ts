import { Test, TestingModule } from '@nestjs/testing';
import { ThreadsController } from './threads.controller';
import { CreateThreadUseCase } from '../use-cases/create-thread.use-case';
import { LlmFacade } from '../ports/LlmFacade';
import { CanActivate, InternalServerErrorException } from '@nestjs/common';
import { err, success } from '@context-gpt/errors';
import { DomainError } from '@context-gpt/server-shared-errors';
import { AuthGuard, withMockAuthUser } from '@context-gpt/server-auth';
import { mockRequest } from '@context-gpt/server-http';

class MockAuthGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('ThreadsController', () => {
  let controller: ThreadsController;
  let createThreadUseCase: jest.Mocked<CreateThreadUseCase>;

  beforeEach(async () => {
    const mockCreateThreadUseCase = {
      execute: jest.fn(),
    };

    const mockLlmFacade = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThreadsController],
      providers: [
        { provide: CreateThreadUseCase, useValue: mockCreateThreadUseCase },
        { provide: LlmFacade, useValue: mockLlmFacade },
      ],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .compile();

    controller = module.get<ThreadsController>(ThreadsController);
    createThreadUseCase = module.get(CreateThreadUseCase);
  });

  describe('createThread', () => {
    it('creates a thread successfully', async () => {
      const threadId = '123e4567-e89b-12d3-a456-426614174000';
      createThreadUseCase.execute.mockResolvedValue(success({ threadId }));

      const result = await controller.createThread(withMockAuthUser(mockRequest(), 'user123'));

      expect(result).toEqual({ threadId });
      expect(createThreadUseCase.execute).toHaveBeenCalledWith({ userId: 'user123' });
    });

    it('throws InternalServerErrorException on error', async () => {
      createThreadUseCase.execute.mockResolvedValue(err(new DomainError('Error creating thread')));

      await expect(controller.createThread(withMockAuthUser(mockRequest(), 'user123'))).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
