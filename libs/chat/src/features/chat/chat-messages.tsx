import React, { useContext, useEffect } from 'react';
import { ChatDomainContext } from './chat-domain.context';
import { useStore } from 'zustand';
import { Message } from '../../model/Message';
import MessageContent from '../../ui/message-content';

export const ChatMessages: React.FC = () => {
  const store = useContext(ChatDomainContext);

  if (!store) throw new Error('ChatStore not provided in the component tree');

  const messages = useStore(store, (state) => state.messages);
  const streaming = useStore(store, (state) => state.streaming);

  useEffect(() => {
    if (!streaming && messages.length > 0) {
      console.log(messages[messages.length - 1].content);
    }
  }, [messages, streaming]);

  return (
    <div className="px-8" id={'chat-messages'}>
      {messages.map((message: Message, index: number) => (
        <div key={index} className={`message ${message.sender.toLowerCase()}`}>
          <MessageContent message={message} />
        </div>
      ))}
    </div>
  );
};
