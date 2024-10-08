import { DomainError } from '@context-gpt/server-shared-errors';

export class InvalidCredentialError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialError';
  }
}

export class InvalidTokenError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTokenError';
  }
}
