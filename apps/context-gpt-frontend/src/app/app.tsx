import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '@context-gpt/authentication';
import { ChatPage } from '@context-gpt/chat';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
