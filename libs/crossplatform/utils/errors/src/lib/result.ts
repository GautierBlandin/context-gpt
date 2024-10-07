export type Result<SUCCESS_TYPE, ERROR_TYPE> =
  | {
      type: 'success';
      value: SUCCESS_TYPE;
      error?: never;
    }
  | {
      type: 'error';
      error: ERROR_TYPE;
      value?: never;
    };

export type ResultAsync<SUCCESS_TYPE, ERROR_TYPE> = Promise<Result<SUCCESS_TYPE, ERROR_TYPE>>;

export function success<SUCCESS_TYPE>(value: SUCCESS_TYPE): Result<SUCCESS_TYPE, never> {
  return {
    type: 'success',
    value,
  };
}

export function err<ERROR_TYPE>(error: ERROR_TYPE): Result<never, ERROR_TYPE> {
  return {
    type: 'error',
    error,
  };
}
