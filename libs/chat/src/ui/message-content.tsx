import React from 'react';
import { Message } from '../model/Message';
import { Markdown } from '@context-gpt/shared';

interface MessageContentProps {
  message: Message;
}

const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  return <Markdown content={message.content} />;
};

export default MessageContent;
