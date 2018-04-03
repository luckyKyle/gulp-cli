import { equals } from '../util/object'

const a = { a: [2, { e: 3 }], b: [4], c: 'foo' }
const b = { a: [2, { e: 3 }], b: [4], c: 'foo' }

console.log(equals(a, b))