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
    <div className="flex flex-col gap-4">
      {messages.map((message: Message, index: number) => (
        <div key={index} className={`flex w-full ${message.sender === 'User' ? 'justify-start' : 'justify-end'}`}>
          <div
            className={`max-w-[100%] rounded-lg p-3 ${
message.sender === 'User' ? 'bg-blue-100 text-black' : 'bg-gray-200 text-black' }`}
          >
            <Markdown content={message.content} />
          </div>
        </div>
      ))}
    </div>
  );
};
