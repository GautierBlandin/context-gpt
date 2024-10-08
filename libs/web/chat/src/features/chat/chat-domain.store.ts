import { createStore } from 'zustand';
import { Chunk, Message } from '../../core';
import { LLMProxyDi } from '../../compositionRoot';

interface ChatDomainState {
  messages: Message[];
  streaming: boolean;
  actions: ChatDomainActions;
}

interface ChatDomainActions {
  sendMessage: (message: Message) => void;
  addChunk: (chunk: Chunk) => void;
  endResponse: () => void;
}

export type ChatDomainStore = ReturnType<typeof createChatDomainStoreFactory>;

export const createChatDomainStoreFactory = () =>
  createStore<ChatDomainState>((set, get) => {
    const llmProxy = LLMProxyDi.getInstance();

    return {
      messages: [],
      streaming: false,

      actions: {
        sendMessage: (message: Message) => {
          const streaming = get().streaming;

          if (streaming) {
            throw new Error('Cannot send message while streaming');
          }

          set((state) => ({
            messages: [...state.messages, message],
            streaming: true,
          }));

          const promptLLM = (messages: Message[]) => {
            llmProxy.sendPrompt({
              messages,
              addChunkCallback: get().actions.addChunk,
              endCallback: get().actions.endResponse,
            });
          };

          promptLLM(get().messages);
        },

        addChunk: (chunk: Chunk) => {
          set((state) => {
            const lastMessage = state.messages[state.messages.length - 1];
            if (lastMessage && lastMessage.sender === 'Assistant') {
              const updatedMessages = [...state.messages];
              updatedMessages[updatedMessages.length - 1] = {
                ...lastMessage,
                content: lastMessage.content + chunk.content,
              };
              return { messages: updatedMessages };
            } else {
              return {
                messages: [...state.messages, { content: chunk.content, sender: 'Assistant' }],
              };
            }
          });
        },

        endResponse: () => {
          set({ streaming: false });
        },
      },
    };
  });
