/** If not clonable, necessary to special-case `DOMException`s (pending https://github.com/whatwg/webidl/pull/1421) */
export const DOM_EXCEPTION_IS_CLONABLE = structuredClone(new DOMException()) instanceof Error
