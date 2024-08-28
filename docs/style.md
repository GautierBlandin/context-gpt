# Style guide

## What is more important comes first
Use hoisting !

```ts
// The function fooBar is the export of the file and the consumer of foo and bar.
// It must be declared before foo and bar, rather than after.

// fooBar.ts
export function fooBar() {
  return foo() + bar();
}

function foo() {
  return 1;
}

function bar() {
  return 2;
}

// This also goes for interfaces:
// FooBar consumes Foo and Bar, and is therefore declared first.
interface FooBar {
  foo: Foo;
  bar: Bar;
}

interface Foo {
  foo: number;
}

interface Bar {
  bar: number;
}
```

## Functions

- Do not put more than 2 arguments in a function. Instead, put the arguments in a single object.
- Prefer the `function` keyword for top-level functions
- Prefer the `const` keyword for local (nested) functions

## Classes

- According to the 'What is more important comes first', private methods are declared last
- Fields must be declared before methods
- Every field and method should have an explicit access modifier

## Interfaces

- Do not prefix interface names with `I`. Instead, prefer prefixing implementations with relevant words,
  e.g `DynamoDbUserRepository`, `FakeUserRepository`.

## React components

- Prefer the `function` keyword for top-level React components, eg:
```tsx
interface MyComponentProps {
  name: string;
}

export function MyComponent({ name }: MyComponentProps) {
  return <div>Hello, {name}!</div>;
}
```
- Components should have an appropriate role when possible, and an aria-label to help screen readers and e2e tests

## CSS

- Use Tailwind CSS
- Avoid using margins. See [this article](https://mxstbr.com/thoughts/margin) as to why

## Exports

- Prefer named exports over default exports

## Testing

- Do not import globals, instead import directly from `vitest`, e.g

```ts
import { expect, it, describe } from 'vitest';
```
