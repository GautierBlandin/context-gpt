import { LlmFacadeFake } from './LLmFacade.fake';
import { lastValueFrom, toArray } from 'rxjs';

describe('LlmFacade', () => {
  it('returns the chunks that have been set', async () => {
    const { llmFacade } = setup();

    const expectedChunks = [{ content: 'Hello' }, { content: 'World' }];

    llmFacade.setChunks(expectedChunks);

    const obs = llmFacade.prompt({ messages: [] });

    const chunks = await lastValueFrom(obs.pipe(toArray()));

    expect(chunks).toMatchObject(expectedChunks);
  });

  it('emits an error when setError is called', (done) => {
    const { llmFacade } = setup();

    const expectedError = 'No credit left';

    llmFacade.setError(expectedError);

    const obs = llmFacade.prompt({ messages: [] });

    obs.subscribe({
      error: (error) => {
        try {
          expect(error).toBe(expectedError);
          done();
        } catch (e) {
          done(e);
        }
      },
    });
  });

  it('completes after the chunks have been set', async () => {
    const { llmFacade } = setup();

    const expectedChunks = [{ content: 'Hello' }, { content: 'World' }];

    llmFacade.setChunks(expectedChunks);

    const obs = llmFacade.prompt({ messages: [] });

    await lastValueFrom(obs.pipe(toArray()));
  });

  it('keeps an history of sent messages', async () => {
    const { llmFacade } = setup();

    llmFacade.prompt({ messages: [{ content: 'Hello', sender: 'user' }] });

    expect(llmFacade.getHistory()).toMatchObject([[{ content: 'Hello', sender: 'user' }]]);
  });
});

const setup = () => {
  return {
    llmFacade: new LlmFacadeFake(),
  };
};
