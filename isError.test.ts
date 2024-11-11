import { errorIsError } from './isError.ts'
import { assertEquals } from '@std/assert'

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

Deno.test(`${errorIsError.name}`, async (t) => {
	await t.step('errors are errors', () => {
		for (const item of ERRORS) {
			assertEquals(errorIsError(item), true)
		}
	})
	await t.step('non-errors are not errors', () => {
		for (const item of NON_ERRORS) {
			assertEquals(errorIsError(item), false)
		}
	})
})
