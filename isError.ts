// @ts-expect-error 'this' types incompatible: 'unknown' is not assignable to '(this: any, ...args: any[]) => unknown'.
const toStr = Function.bind.call(Function.call, Object.prototype.toString)

/**
 * Checks if the argument is an Error.
 * @param arg - The argument to check.
 * @returns `true` if the `arg` is an Error, `false` otherwise.
 */
export const errorIsError = (arg: unknown): arg is Error => {
	// https://github.com/tc39/proposal-is-error/issues/16
	const str = toStr(arg)
	return str === '[object Error]' || str === '[object DOMException]'
}

Object.defineProperty(errorIsError, 'name', { value: 'isError' })
