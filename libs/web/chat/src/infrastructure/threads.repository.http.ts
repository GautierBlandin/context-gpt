import { ThreadsRepository } from '../ports/threads.repository';
import { Thread } from '../core/Thread';
import { getSdk } from '@context-gpt/context-gpt-sdk';
import { err, ResultAsync, success } from '@context-gpt/errors';

export class ThreadsRepositoryImpl implements ThreadsRepository {
  private sdk = getSdk().threads;

  public async createThread(): ResultAsync<Thread, Error> {
    const { data, error } = await this.sdk.createThread();

    if (error) {
      return err(new Error(`Failed to create thread: ${error?.message ?? 'Unknown error'}`));
    }

    return success({
      id: data.threadId,
      messages: data.messages,
    } satisfies Thread);
  }
}
