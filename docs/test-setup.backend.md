# Test files

Tests are made up of three parts:
- Arrange
- Act
- Assert

We use the object mother pattern when we need to create complex objects for testing purposes.

Avoid using 'should' in test names. Instead, prefer the imperative form. 
For example, instead of ```it('should save a thread')```, use ```it('saves a thread')```.

Example of a test file:

```typescript
describe('PostMessageUseCase', () => {
  let useCase: PostMessageUseCase;
  let threadRepository: ThreadsRepositoryFake;
  let llmFacade: LlmFacadeFake;
  
  beforeEach(() => {
    threadRepository = new ThreadsRepositoryFake();
    llmFacade = new LlmFacadeFake();
    useCase = new PostMessageUseCase(threadRepository, llmFacade);
  });
  
  it('adds a new message to the thread', async () => {
    const thread = ThreadMother.emptyThread('thread-id');
    threadRepository.save(thread);
    
    llmFacade.setAnswer('Hello, how are you?');
    
    await useCase.postMessage({ threadId: 'thread-id', content: 'Hello, how are you?' });
    
    expect(threadRepository.get(thread.id)).toMatchObject({
      messages: [
        { sender: 'user', content: 'Hello, how are you?' },
        { sender: 'assistant', content: 'Hello, how are you?' },
      ],
    });
  })
})
```
