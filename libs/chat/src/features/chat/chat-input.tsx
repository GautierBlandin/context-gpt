// Dev/context-gpt/libs/chat/src/features/chat/chat-input.tsx

import React, { useContext } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { Message } from '../../model/Message';
import { useStore } from 'zustand';
import { CompositeInput } from './composite-input';

export const ChatInput: React.FC = () => {
  const store = useContext(ChatDomainContext);

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const streaming = useStore(store, (state) => state.streaming);
  const actions = useStore(store, (state) => state.actions);

  const handleSendMessage = (inputText: string) => {
    const message: Message = { content: inputText, sender: 'User' };
    actions.sendMessage(message);
  };

  return <CompositeInput onSubmit={handleSendMessage} placeholder="Type your message..." disabled={streaming} />;
};
