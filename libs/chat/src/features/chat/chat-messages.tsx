import React, { useContext } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { useStore } from 'zustand';
import { Message } from '../../model/Message';
import { Markdown } from '@context-gpt/shared/ui';

export const ChatMessages: React.FC = () => {
  const store = useContext(ChatDomainContext);

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const messages = useStore(store, (state) => state.messages);

  return (
    <>
      {messages.map((message: Message, index: number) => (
        <div key={index} className={`message ${message.sender.toLowerCase()}`}>
          <Markdown content={message.content} />
        </div>
      ))}
    </>
  );
};
