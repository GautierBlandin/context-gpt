import { Thread } from '../core/Thread';
import { ResultAsync } from '@context-gpt/errors';

export interface ThreadsRepository {
  createThread(): ResultAsync<Thread, Error>;
}
