import { RegisterForm } from '../ui/RegisterForm';
import { authenticationStore } from './Authentication.store';

export function RegisterFormController() {
  const handleRegister = authenticationStore.register.bind(authenticationStore);

  return <RegisterForm onRegister={handleRegister} />;
}
