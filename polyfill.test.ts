import './polyfill.ts'
import type { errorIsError } from './isError.ts'
import { assertEquals } from '@std/assert'

declare global {
	interface ErrorConstructor {
		isError: typeof errorIsError
	}
}

const ERRORS = [
	new Error(),
	new TypeError(),
	new SyntaxError(),
	new ReferenceError(),
	new DOMException(),
	new (class extends Error {})(),
]

const NON_ERRORS = [
	0,
	1n,
	null,
	undefined,
	true,
	false,
	Symbol(),
	Symbol.for('foo'),
	'',
	new String(''),
	[],
	{},
	new Date(),
	new (class extends Date {})(),
]

Deno.test(`${Error.name}.${Error.isError.name}`, async (t) => {
	await t.step('errors are errors', () => {
		for (const item of ERRORS) {
			assertEquals(Error.isError(item), true)
		}
	})
	await t.step('non-errors are not errors', () => {
		for (const item of NON_ERRORS) {
			assertEquals(Error.isError(item), false)
		}
	})
})
