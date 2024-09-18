# Repositories

We use the ports/infrastructure architecture to provide driven ports to the application.
We use the singleton pattern to inject the ports into the application.

Example:

```ts
// ports/threads.repository.ts
interface ThreadsRepository {
  getThread(id: string): Promise<Thread>;
  postMessage(message: Message, theadId: string): Promise<Thread>;
}
```

```ts
// ports/threads.repository.fake.ts
export class FakeThreadsRepository implements ThreadsRepository {
  private threads: Map<string, Thread> = new Map();
  
  public setThreads(threads: Thread[]) {
    threads.forEach((thread) => this.threads.set(thread.id, thread));
  }

  async getThread(id: string): Promise<Thread> {
    const thread = this.threads.get(id);
    if (!thread) {
      throw new Error(`Thread with id ${id} not found`);
    }
    return thread;
  }

  async postMessage(message: Message, threadId: string): Promise<Thread> {
    const thread = await this.getThread(threadId);
    thread.messages.push(message);
    this.threads.set(threadId, thread);
    return thread;
  }
}
```

```ts
// infrastructure/threads.repository.http.ts

export class HttpThreadsRepository implements ThreadsRepository {
  async getThread(id: string): Promise<Thread> {
    const response = await fetch(`/threads/${id}`);
    return await response.json();
  }

  async postMessage(message: Message, threadId: string): Promise<Thread> {
    const response = await fetch(`/threads/${threadId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
    return await response.json();
  }
}
```

```ts
// composition-root/threads.repository.singleton.ts
import { ThreadsRepository } from '../ports/threads.repository';
import { FakeThreadsRepository } from '../ports/threads.repository.fake';
import { HttpThreadsRepository } from '../infrastructure/threads.repository.http';

export const threadsRepositorySingleton = singletonFactory<ThreadRepository>({
  factory: () => new HttpThreadsRepository(),
});
```

```ts
// test file of a consumer of the repository

import { threadsRepositorySingleton } from '../composition-root/threads.repository.singleton';
import { FakeThreadsRepository } from '../ports/threads.repository.fake';

const setup = () => {
  const threadsRepository = new FakeThreadsRepository();
  threadsRepositorySingleton.override(threadsRepository);

  return {
    threadsRepository,
  }
}
```
