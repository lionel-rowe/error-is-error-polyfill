// @ts-expect-error 'this' types incompatible: 'unknown' is not assignable to '(this: any, ...args: any[]) => unknown'.
const toStr = Function.bind.call(Function.call, Object.prototype.toString)

/**
 * Checks if the argument is an Error.
 * @param arg - The argument to check.
 * @returns `true` if the `arg` is an Error, `false` otherwise.
 */
export const errorIsError = (arg: unknown): arg is Error => {
	try {
		if (arg == null || typeof arg !== 'object') return false

		// https://github.com/tc39/proposal-is-error/issues/16
		if (toStr(arg) === '[object DOMException]') return true

		return structuredClone(arg) instanceof Error
	} catch {
		return false
	}
}

Object.defineProperty(errorIsError, 'name', { value: 'isError' })
