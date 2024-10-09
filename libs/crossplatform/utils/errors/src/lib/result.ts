export type Result<SUCCESS_TYPE, ERROR_TYPE extends Error> =
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

export type ResultAsync<SUCCESS_TYPE, ERROR_TYPE extends Error> = Promise<Result<SUCCESS_TYPE, ERROR_TYPE>>;

export function success<SUCCESS_TYPE>(value: SUCCESS_TYPE): Result<SUCCESS_TYPE, never> {
  return {
    type: 'success',
    value,
  };
}

export function err<ERROR_TYPE extends Error>(error: ERROR_TYPE): Result<never, ERROR_TYPE> {
  return {
    type: 'error',
    error,
  };
}

export function toThrowing<SUCCESS_TYPE, ERROR_TYPE extends Error>(
  result: Result<SUCCESS_TYPE, ERROR_TYPE>,
): SUCCESS_TYPE {
  if (result.type === 'error') {
    throw result.error;
  }
  return result.value;
}

export function toPromise<SUCCESS_TYPE, ERROR_TYPE extends Error>(
  result: ResultAsync<SUCCESS_TYPE, ERROR_TYPE>,
): Promise<SUCCESS_TYPE> {
  return new Promise((resolve, reject) => {
    result.then((result) => {
      if (result.type === 'error') {
        reject(result.error);
      } else {
        resolve(result.value);
      }
    });
  });
}
