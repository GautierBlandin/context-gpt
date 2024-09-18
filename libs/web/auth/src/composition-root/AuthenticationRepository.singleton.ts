import { singletonFactory } from '@context-gpt/di';
import { AuthenticationRepositoryImpl } from '../infrastructure';
import { AuthenticationRepository } from '../ports';

export const AuthenticationRepositorySingleton = singletonFactory<AuthenticationRepository>({
  factory: () => new AuthenticationRepositoryImpl(),
});
