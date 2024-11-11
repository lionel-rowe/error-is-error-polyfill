# `Error.isError` polyfill and ponyfill [![JSR](https://jsr.io/badges/@li/error-is-error-polyfill)](https://jsr.io/@li/error-is-error-polyfill)

Lightweight polyfill and ponyfill for the upcoming [`isError()`](https://github.com/tc39/proposal-is-error/) static method of `Error` (proposal currently at Stage 2.7).

Currently passes all [test262](https://github.com/tc39/test262/tree/main/test/built-ins/Error/isError) tests except for cross-realm tests and `fake-errors.js`. It's not possible to create a spoof-resistant `Error.isError` implementation in userland, because `Error.isError` is supposed to check for the presence of the `[[ErrorData]]` internal slot.

## Polyfill

Polyfilling with types:

```ts
import from '@li/error-is-error-polyfill/global'
import type { errorIsError } from '@li/error-is-error-polyfill'

declare global {
	interface ErrorConstructor {
		isError: typeof errorIsError
	}
}
```
