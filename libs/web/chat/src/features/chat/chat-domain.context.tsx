import React from 'react';
import { ChatDomainStore } from './chat-domain.store';

export const ChatDomainContext = React.createContext<ChatDomainStore | null>(null);
