# Error handling

Error should be thrown explicitly and as early as possible. 

Error handling should generally be done at the boundary of the system (adapter level).

Error are mostly of two types:
- Domain / business errors: Errors that are business-related and are thrown by the domain and use-cases layer.
These errors are sent because a business invariant is violated. At the API level, these errors should be returned as HTTP 400 Bad Request.
- Infrastructure errors: Errors that are caused by the infrastructure layer. These errors are sent because the system is unable to perform the requested operation.
These errors should be returned as HTTP 500 Internal Server Error.

## Domain errors

Domain errors are thrown using the `DomainError` class:

```ts
import { DomainError } from '@context-gpt/server-shared/errors';

if (user.password.length < 8) {
  throw new DomainError('Password must be at least 8 characters long');
}
```
