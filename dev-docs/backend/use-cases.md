# Use-cases

Use-cases represent workflows that the application is capable of performing.

Here is how a use-case file is structured:

```ts
interface UseCaseNameInput {
  // Input parameters for the use-case
}

interface UseCaseNameOutput {
  // Output parameters for the use-case
}

export abstract class UseCaseName {
  abstract execute(input: UseCaseNameInput): Promise<Result<UseCaseNameOutput, Error>>;
}

export class UseCaseNameImpl extends UseCaseName {
  async execute(input: UseCaseNameInput): Promise<Result<UseCaseNameOutput, Error>> {
    // Implementation of the use-case
  }
}
```
