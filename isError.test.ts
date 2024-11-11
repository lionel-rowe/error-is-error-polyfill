import { ERRORS, NON_ERRORS } from './_fixtures.ts'
import { errorIsError } from './isError.ts'
import { assertEquals } from '@std/assert'

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
