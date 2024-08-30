import { Env } from './env';

export class EnvFake extends Env {
  private env: Record<string, string | undefined> = {};

  set(key: string, value: string): void {
    this.env[key] = value;
  }

  clear(key: string): void {
    delete this.env[key];
  }

  get(key: string): string | undefined {
    return this.env[key];
  }
}
