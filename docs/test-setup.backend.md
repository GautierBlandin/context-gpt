# Test files

Tests are made up of three parts:
- Arrange
- Act
- Assert

We include a setup function in the test that is called at the beginning of each test to provide
the necessary dependencies for the test.

We use the object mother pattern when we need to create complex objects for testing purposes.

Example of a test file:

```typescript
describe('PostMessageUseCase', () => {
  it('add a new message to the thread', async () => {
    const { threadRepository, llmFacade, useCase } = setup();
    
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

const setup = () => {
  const threadRepository = new ThreadsRepositoryFake();
  const llmFacade = new LlmFacadeFake();
  const useCase = new PostMessageUseCase(threadRepository, llmFacade);
  
  return {
    threadRepository,
    llmFacade,
    useCase,
  };
}
```
