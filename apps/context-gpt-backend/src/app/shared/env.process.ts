import { Env } from './env';

export class ProcessEnv implements Env {
  get(key: string): string | undefined {
    return process.env[key];
  }
}
