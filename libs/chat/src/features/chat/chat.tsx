'use client';
import { ChatDomainContext } from './chatDomain.context';
import { createChatDomainStoreFactory } from './chatDomain.store';
import { useContext, useMemo } from 'react';

export function Chat() {
  const store = useMemo(() => createChatDomainStoreFactory(), []);

  return <ChatDomainContext.Provider value={store}>
    <ChatBody />
  </ChatDomainContext.Provider>
}

function ChatBody() {
  console.log(process.env.NEXT_PUBLIC_CLAUDE_API_KEY);

  const store = useContext(ChatDomainContext);
  if (!store) throw new Error('ChatStore not provided in the component tree');

  return <div>Chat Body</div>
}
