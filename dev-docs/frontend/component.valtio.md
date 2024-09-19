Headless component using valtio:
```tsx
// useCounter.tsx

import { useMemo, useRef } from 'react';
import { proxy, useSnapshot } from 'valtio';

class Counter {
  public count = 0;

  public increment() {
    this.count++;
  }
}

export function useCounter() {
  const counterRef = useRef(proxy(new Counter()));
  const { count } = useSnapshot(counterRef.current);

  const doubled = useMemo(() => {
    return count * 2;
  }, [count]);

  return {
    count,
    doubled,
    increment: () => {
      counterRef.current.increment();
    },
  };
}
```
