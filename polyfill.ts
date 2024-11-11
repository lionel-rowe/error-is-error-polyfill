import { errorIsError } from './isError.ts'

Object.defineProperty(Error, 'isError', {
	value: errorIsError,
	writable: true,
	enumerable: false,
	configurable: true,
})
