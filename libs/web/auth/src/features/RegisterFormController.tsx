import { RegisterForm } from '../ui/RegisterForm';
import { authenticationStore } from './Authentication.store';

export function RegisterFormController() {
  return <RegisterForm onRegister={authenticationStore.register} />;
}
