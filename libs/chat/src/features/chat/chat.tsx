'use client';
import { ChatDomainContext } from './chat-domain.context';
import { createChatDomainStoreFactory } from './chat-domain.store';
import React, { useContext, useMemo } from 'react';
import { WiredChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';

export function Chat() {
  const store = useMemo(() => createChatDomainStoreFactory(), []);

  return (
    <ChatDomainContext.Provider value={store}>
      <ChatBody />
    </ChatDomainContext.Provider>
  );
}

function ChatBody() {
  const store = useContext(ChatDomainContext);
  if (!store) throw new Error('ChatStore not provided in the component tree');

  return (
    <div className="h-screen overflow-x-hidden" id={'full-chat'}>
      <div className="h-full w-full max-w-4xl mx-auto px-4">
        <div className="flex flex-col h-full w-full">
          <div className="flex-grow overflow-y-auto overflow-x-hidden">
            <ChatMessages />
          </div>
          <div className="flex-shrink-0 w-full">
            <WiredChatInput />
          </div>
        </div>
      </div>
    </div>
  );
}
