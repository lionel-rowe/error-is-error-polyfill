import './polyfill.ts'
import type { errorIsError } from './isError.ts'
import { assertEquals } from '@std/assert'
import { ERRORS, NON_ERRORS } from './_fixtures.ts'

declare global {
	interface ErrorConstructor {
		isError: typeof errorIsError
	}
}

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
