import { Env } from './env';

export class EnvFake implements Env {
  private env: Record<string, string | undefined> = {};

  set(key: string, value: string): void {
    this.env[key] = value;
  }

  get(key: string): string | undefined {
    return this.env[key];
  }
}
