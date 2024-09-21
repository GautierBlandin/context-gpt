import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage, RegisterPage } from '@context-gpt/authentication';
import { ChatPage } from '@context-gpt/chat';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/chat" replace />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
