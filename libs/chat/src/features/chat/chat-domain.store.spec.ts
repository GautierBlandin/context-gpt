import { LLMProxyFake } from '../../ports';
import { LLMProxyDi } from '../../compositionRoot';
import { createChatDomainStoreFactory } from './chat-domain.store';

describe('chat store', () => {
  it('should send a user message', () => {
    const { store } = setup();

    store.getState().actions.sendMessage({ content: 'Hello', sender: 'User' });
    expect(store.getState().messages).toEqual([{ content: 'Hello', sender: 'User' }]);
  });

  it('should handle the streaming response', async () => {
    const { llmProxyFake, store } = setup();
    vi.useFakeTimers();

    llmProxyFake.setResponse(['Hello', ' World']);

    store.getState().actions.sendMessage({ content: 'Hello', sender: 'User' });
    expect(store.getState().streaming).toBe(true);

    await vi.advanceTimersByTimeAsync(1);

    expect(store.getState().messages).toEqual([
      { content: 'Hello', sender: 'User' },
      { content: 'Hello', sender: 'Assistant' },
    ]);
    expect(store.getState().streaming).toBe(true);

    await vi.advanceTimersByTimeAsync(1);

    expect(store.getState().messages).toEqual([
      { content: 'Hello', sender: 'User' },
      { content: 'Hello World', sender: 'Assistant' },
    ]);
    expect(store.getState().streaming).toBe(false);
  });

  it('should throw an error when sending a message while streaming', async () => {
    const { store, llmProxyFake } = setup();

    vi.useFakeTimers();

    llmProxyFake.setResponse(['Hello', ' World']);

    store.getState().actions.sendMessage({ content: 'Hello', sender: 'User' });

    expect(store.getState().streaming).toBe(true);
    expect(() => store.getState().actions.sendMessage({ content: 'Hello', sender: 'User' })).toThrowError(
      'Cannot send message while streaming',
    );
  });
});

const setup = () => {
  LLMProxyDi.reset();
  const llmProxyFake = new LLMProxyFake();
  llmProxyFake.setDelay(1);
  LLMProxyDi.setOverride(llmProxyFake);

  const store = createChatDomainStoreFactory();

  return {
    llmProxyFake,
    store,
  };
};
