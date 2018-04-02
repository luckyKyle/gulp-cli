import { filterNonUnique } from './util/array'
// import 'babel-polyfill'

let a = { a1: 111, a2: 222 }
let b = { b1: 333, b2: 444 }
let c = Object.assign(a, b)


console.log(filterNonUnique([1, 2, 2, 3, 4, 4, 5, 6, 7, 9, 8]))
console.log(c)