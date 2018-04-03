import { filterNonUnique } from './util/array'
import { setStorage, getStorage, hasStorage, removeStorage, clearStorage } from './util/storage'
// import 'babel-polyfill'

let a = { a1: '111', a2: 222 }
let b = { b1: 333, b2: 444 }
let c = Object.assign(a, b)

console.log(filterNonUnique([1, 2, 2, 3, 4, 4, 5, 6, 7, 9, 8]))
console.log(c)

let btn1 = document.querySelector('#btn1')
let btn2 = document.querySelector('#btn2')
let btn3 = document.querySelector('#btn3')
let btn4 = document.querySelector('#btn4')
let btn5 = document.querySelector('#btn5')

btn1.onclick = function() {
    setStorage('id', c)
}

btn2.onclick = function() {
    console.log(getStorage('id'))
}

btn3.onclick = function() {
    console.log(hasStorage('id'))
}

btn4.onclick = function() {
    console.log('移除')
    removeStorage('id')
}

btn5.onclick = function() {
    console.log('清空')
    clearStorage()
}
