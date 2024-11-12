import { DOM_EXCEPTION_IS_CLONABLE } from './_consts.ts'

const fakeError = {
	constructor: Error,
	name: 'Error',
	message: '',
	stack: new Error().stack,
	[Symbol.toStringTag]: 'Error',
}

Object.setPrototypeOf(fakeError, Error.prototype)

const fakeDomException = {
	constructor: DOMException,
	name: 'DOMException',
	message: '',
	stack: new DOMException().stack,
	[Symbol.toStringTag]: 'DOMException',
}

Object.setPrototypeOf(fakeDomException, DOMException.prototype)

export const ERRORS = [
	new Error(),
	new TypeError(),
	new SyntaxError(),
	new ReferenceError(),
	new DOMException(),
	new (class extends Error {})(),
	new (class extends DOMException {})(),
]

export const NON_ERRORS = [
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
	fakeError,
	// only test this if not special-cased (will fail if special-cased)
	...(DOM_EXCEPTION_IS_CLONABLE ? [fakeDomException] : []),
]
