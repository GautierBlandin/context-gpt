import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { DomainError } from '@context-gpt/server-shared-errors';

interface UserState {
  type: 'active';
  id: string;
  email: string;
  hashedPassword: string;
}

export class User {
  private constructor(public readonly state: UserState) {}

  static create(params: { email: string; password: string }): User {
    if (!this.isValidEmail(params.email)) {
      throw new DomainError('Invalid email');
    }

    if (params.password.length < 8) {
      throw new DomainError('Password must be at least 8 characters long');
    }

    const hashedPassword = bcrypt.hashSync(params.password, 10);

    return new User({
      type: 'active',
      id: uuidv4(),
      email: params.email,
      hashedPassword: hashedPassword,
    });
  }

  static from(state: UserState): User {
    return new User(state);
  }

  validateCredentials(password: string): boolean {
    return bcrypt.compareSync(password, this.state.hashedPassword);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
