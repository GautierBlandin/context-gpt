import React, { useState, useContext } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { Message } from '../../model/Message';
import { SubmitButton, TextInput } from '@context-gpt/shared';
import { useStore } from 'zustand';

export const ChatInput: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const store = useContext(ChatDomainContext);

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const streaming = useStore(store, (state) => state.streaming);
  const actions = useStore(store, (state) => state.actions);

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '' || streaming) return;

    const message: Message = { content: inputText, sender: 'User' };
    actions.sendMessage(message);
    setInputText('');
  };

  return (
    <div>
      <TextInput value={inputText} onChange={handleInputChange} placeholder="Type your message..." />
      <SubmitButton onClick={handleSendMessage} disabled={streaming || inputText.trim() === ''}>
        Send
      </SubmitButton>
    </div>
  );
};
