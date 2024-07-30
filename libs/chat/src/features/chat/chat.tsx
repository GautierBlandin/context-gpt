'use client';
import { ChatDomainContext } from './chat-domain.context';
import { createChatDomainStoreFactory } from './chat-domain.store';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { WiredChatInput } from './chat-input';
import { ChatMessages } from './chat-messages';
import { useStore } from 'zustand';

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

  const messages = useStore(store, (state) => state.messages);

  // To understand the scrolling logic, see the chat.scroll.mermaid file
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer && shouldScrollToBottom) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages, shouldScrollToBottom]);

  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      const isScrolledToBottom =
        Math.abs(scrollContainer.scrollHeight - scrollContainer.clientHeight - scrollContainer.scrollTop) < 1;
      setShouldScrollToBottom(isScrolledToBottom);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" id={'full-chat'}>
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto overflow-x-hidden" onScroll={handleScroll}>
        <div className="h-full w-full px-4">
          <div className="max-w-4xl mx-auto">
            <ChatMessages />
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-full px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <WiredChatInput />
        </div>
      </div>
    </div>
  );
}
