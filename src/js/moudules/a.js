import { equals } from '../util/object'

export const a = { a: [2, { e: 3 }], b: [4], c: 'foo' }
export const b = { a: [2, { e: 3 }], b: [4], c: 'foo' }
export const c = equals(a, b)
