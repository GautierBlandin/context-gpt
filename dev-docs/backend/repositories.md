# Repositories

Repositories are the interface that is used by use-cases to load and persis
aggregates.

Repositories typically have three kind of methods:

- Save(aggregate): Save the state of the aggregate to the persistence layer.
- Get(id): Get an aggregate from the persistence layer. Returns the aggregate instance.
Get should throw an error if the aggregate does not exist.
- Queries: Queries are methods that returns zero, one, or many aggregates.
Queries implement the required access patterns for the system to work properly.

## Example repository

```typescript
export abstract class ThreadsRepository {
  abstract save(thread: Thread): Promise<Result<void, InfrastructureError>>;
  abstract get(id: string): Promise<Result<Thread, InfrastructureError | DomainError>>;
  abstract listForUser(userId: string): Promise<Result<Thread[], InfrastructureError | DomainError>>;
}
```
