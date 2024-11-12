import { DOM_EXCEPTION_IS_CLONABLE } from './_consts.ts'

/**
 * Checks if the argument is an Error.
 * @param arg - The argument to check.
 * @returns `true` if the `arg` is an Error, `false` otherwise.
 */
export const errorIsError = (arg: unknown): arg is Error => {
	try {
		if (arg == null || typeof arg !== 'object') return false

		if (!DOM_EXCEPTION_IS_CLONABLE && Object.prototype.toString.call(arg) === '[object DOMException]') {
			return true
		}

		return structuredClone(arg) instanceof Error
	} catch {
		return false
	}
}

Object.defineProperty(errorIsError, 'name', { value: 'isError' })
