import { getWord, Person } from "./util"
import { Api, asdasd } from "./api"

getWord("ccc")

let person = new Person("bbb", 12)
let api = new Api

// console.log(person.toString())
// console.log(api.print("abc"))
let aa = { a1: 1111, a2: 2222 },
    bb = { b1: 333, b2: 444 }
let ab = Object.assign(aa, bb)

let values = Object.values(aa)
console.log(ab, values)