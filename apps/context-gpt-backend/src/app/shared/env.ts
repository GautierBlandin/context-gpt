export abstract class Env {
  abstract get(key: string): string | undefined;
}
