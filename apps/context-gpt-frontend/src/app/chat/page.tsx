import { Chat } from '@context-gpt/chat';
import { withAuth } from '@context-gpt/authentication';

export function ChatPage() {
  const AuthenticatedChat = withAuth(Chat);

  return <AuthenticatedChat />;
}
