# `Error.isError` polyfill and ponyfill [![JSR](https://jsr.io/badges/@li/error-is-error-polyfill)](https://jsr.io/@li/error-is-error-polyfill)

Polyfill and ponyfill for the upcoming [`isError()`](https://github.com/tc39/proposal-is-error/) static method of `Error` (proposal currently at Stage 2.7).

Currently passes all [test262](https://github.com/tc39/test262/tree/main/test/built-ins/Error/isError) tests.

It’s not possible to create a 100% spoof-resistant `Error.isError` polyfill in userland, because `Error.isError` checks for the presence of the `[[ErrorData]]` internal slot. This can be checked indirectly by calling `structuredClone()` on the argument, but current implementations do not set the `[[ErrorData]]` slot on `DOMException` instances (pending merging and implementation of [whatwg/webidl #1421](https://github.com/whatwg/webidl/pull/1421)), so those simply return a plain object upon cloning. Because of this, we also check the string representation against `[object DOMException]`, which means any object that gives that exact string from `Object.prototype.toString.call(...)` will return `true`.

## Usage

### Ponyfill

```ts
import { errorIsError } from '@li/error-is-error-polyfill'

errorIsError(new TypeError()) // true
errorIsError({}) // false
```

### Polyfill

Polyfilling with types:

```ts
import '@li/error-is-error-polyfill/global'
import type { errorIsError } from '@li/error-is-error-polyfill'

declare global {
    interface ErrorConstructor {
        isError: typeof errorIsError
    }
}
```

Usage:

```ts
Error.isError(new TypeError()) // true
Error.isError({}) // false
```
