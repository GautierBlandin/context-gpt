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
- Prefer the `function` keyword for top-level functions, including for React components
- Prefer the `const` keyword for local (nested) functions

## Classes

- According to the 'What is more important comes first', private methods are declared last
- Fields must be declared before methods
- Every field and method should have an explicit access modifier
