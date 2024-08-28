import React, { useContext } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { useStore } from 'zustand';
import { Message } from '../../core';
import { Markdown } from '@context-gpt/shared/ui';

export const ChatMessages: React.FC = () => {
  const store = useContext(ChatDomainContext);

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const messages = useStore(store, (state) => state.messages);

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message: Message, index: number) => (
        <div key={index} className={`flex w-full ${message.sender === 'User' ? 'justify-start' : 'justify-end'}`}>
          <div
            className={`${
message.sender === 'User'
                ? 'max-w-[70%] bg-main-primary text-main-onprimary'
                : 'w-full bg-neutral-primary text-neutral-primary hover:bg-neutral-primary-hover'
} rounded-lg p-3`}
          >
            <Markdown content={message.content} />
          </div>
        </div>
      ))}
    </div>
  );
};
