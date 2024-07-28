import React from 'react';
import { ChatDomainStore } from './chatDomain.store';

export const ChatDomainContext = React.createContext<ChatDomainStore | null>(null);
