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
	// // ⚠️ will cause test failure
	// [Symbol.toStringTag]: 'DOMException',
}

// // ⚠️ will cause test failure
// Object.setPrototypeOf(fakeDomException, DOMException.prototype);

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
	fakeDomException,
]
