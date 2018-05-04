// import { filterNonUnique } from './util/array'
import { setStorage, getStorage, hasStorage, removeStorage, clearStorage } from './util/storage'
// import 'babel-polyfill'

let a = { a1: '111', a2: 222 }
let b = { b1: 333, b2: 444 }
let c = Object.assign(a, b)

let btn1 = document.querySelector('#btn1') // 设置
let btn2 = document.querySelector('#btn2') // 获取
let btn3 = document.querySelector('#btn3') // 判断
let btn4 = document.querySelector('#btn4') // 移除
let btn5 = document.querySelector('#btn5') // 清空

btn1.onclick = function() {
    setStorage('test', c)
}
btn2.onclick = function() {
    console.log(getStorage('test'))
}

btn3.onclick = function() {
    console.log(hasStorage('test'))
}

btn4.onclick = function() {
    console.log(removeStorage('test'))
}

btn5.onclick = function() {
    console.log(clearStorage())
}

// console.log(filterNonUnique([31, 1232, 1142, 3, 4, 4, 5, 6, 7, 9, 8]))
// console.log(c)
