'use client';
import { Chat } from '@context-gpt/chat';
import { withAuth } from '@context-gpt/authentication';

const AuthenticatedChat = withAuth(Chat);

export default function ChatPage() {
  return <AuthenticatedChat />;
}
