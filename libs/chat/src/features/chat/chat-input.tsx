import React, { useContext, useState } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { Message } from '../../model/Message';
import { useStore } from 'zustand';
import { ChatInput } from '@context-gpt/shared';

export const WiredChatInput: React.FC = () => {
  const store = useContext(ChatDomainContext);
  const [inputText, setInputText] = useState('');

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const streaming = useStore(store, (state) => state.streaming);
  const actions = useStore(store, (state) => state.actions);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const message: Message = { content: inputText.trim(), sender: 'User' };
      actions.sendMessage(message);
      setInputText('');
    }
  };

  return (
    <ChatInput
      value={inputText}
      onChange={setInputText}
      onSubmit={handleSendMessage}
      disabled={streaming}
      placeholder="Type your message..."
    />
  );
};
