Headless component using valtio:
```tsx
// useCounter.tsx

import { useRef } from 'react';
import { proxy, useSnapshot } from 'valtio';

class Counter {
  public count = 0;

  public increment() {
    this.count++;
  }

  public get doubled() {
    return this.count * 2;
  }
}

export function useCounter() {
  const counterRef = useRef(proxy(new Counter()));
  const { count, doubled } = useSnapshot(counterRef.current);

  return {
    count,
    doubled,
    increment: () => {
      counterRef.current.increment();
    },
  };
}
```
