import { Env } from './env';

export class ProcessEnv extends Env {
  get(key: string): string | undefined {
    return process.env[key];
  }
}
