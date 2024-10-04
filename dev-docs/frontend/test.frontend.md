# Test files

Tests on the frontend use vitest.

Tests are made up of three parts:
- Arrange
- Act
- Assert

We use the object mother pattern when we need to create complex objects for testing purposes.

Avoid using 'should' in test names. Instead, prefer the imperative form.
For example, instead of ```it('should increment count')```, use ```it('increments count')```.

Example of a test file:

```typescript
import { describe, expect, it } from 'vitest';

describe('Counter', () => {
  let counter: Counter;

  beforeEach(() => {
    counter = new Counter();
  });
  
  it('initializes count to 0', () => {
    expect(counter.count).toBe(0);
  });

  it('increments count', () => {
    counter.increment();
    expect(counter.count).toBe(1);
  });
)
```
