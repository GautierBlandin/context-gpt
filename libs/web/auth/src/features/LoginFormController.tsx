import { LoginForm } from '../ui/LoginForm';
import { authenticationStore } from './Authentication.store';

export function LoginFormController() {
  return <LoginForm onLogin={authenticationStore.login} />;
}
