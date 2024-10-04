# Error handling

We do not throw errors. Instead, we return them using the `Result` utility type, imported from `@context-gpt/errors`:

```ts
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
```

This strategy enables us to have get type-safe error handling, and enables control flows that look as follows:

```ts
const {type, value, error} = getUserById(id);

if (type === 'error') {
  // Handle error and return
}

// value is guaranteed to be defined here
```

Error handling should generally be done at the boundary of the system (adapter level).

Error are mostly of two types:
- Domain / business errors: Errors that are business-related and are thrown by the domain and use-cases layer.
These errors are sent because a business invariant is violated. At the API level, these errors should be returned as HTTP 400 Bad Request.
- Infrastructure errors: Errors that are caused by the infrastructure layer. These errors are sent because the system is unable to perform the requested operation.
These errors should be returned as HTTP 500 Internal Server Error.

## Domain errors

Domain errors are thrown using the `DomainError` class:

```ts
import { DomainError } from '@context-gpt/server-shared-errors';

if (user.password.length < 8) {
  return err(new DomainError('Password must be at least 8 characters long'));
}
```

## Bounded-context specific errors

Bounded context can create their own errors to obtain more granularity in error handling.
Bounded context errors should extend the DomainError class:

```ts
import { DomainError } from '@context-gpt/server-shared-errors';

export class InvalidCredentialsError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}
```
