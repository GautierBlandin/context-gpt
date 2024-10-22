/*
 * Check if a key is in a object and the value is defined, and provides type-safety when using union types
 *
 * Example usage:
 * type MyUnion = { foo: string } | { bar?: string | undefined, baz: string }
 *
 * function doSomething(value: MyUnion) {
 *   if (inAndDefined(value, 'bar')) {
 *     console.log(value)
 *     //          ^ { bar: string, baz: string }
 *   }
 * }
 */
export function isInAndDefined<T extends Object, K extends Keys<T>>(
  value: T,
  key: K,
): value is {
  [P in keyof SubUnion<T, K>]-?: P extends K ? Exclude<SubUnion<T, K>[P], undefined> : SubUnion<T, K>[P];
} {
  return key in value && value[key] !== undefined;
}

/* Extract keys from a Union type without intersection of the keys

Example:
type MyUnion = { foo: string } | { bar: string }
keyof MyUnion // never
Keys<MyUnion> // 'foo' | 'bar'
 */
type Keys<Union> = Union extends Union ? keyof Union : never;

/* Extract sub-union types that have a key of type K

type MyUnion = { foo: string } | { bar: string }
SubUnion<MyUnion, 'foo'> // { foo: string }
 */
export type SubUnion<Union, K extends Keys<Union>> = Extract<Union, { [Key in K]?: unknown }>;
