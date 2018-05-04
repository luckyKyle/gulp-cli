// import { filterNonUnique } from './util/array'
import { setStorage, getStorage, hasStorage, removeStorage, clearStorage } from './util/storage'
import * as date from './util/date'

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

// console.log(date.getColonTimeFromDate(new Date()))
// console.log(date.getDaysDiffBetweenDates(new Date('2017-12-13'), new Date('2017-12-22')))
// console.log(date.timestampToTime(1489525200000, true))
// console.log(date.dateToWeek('2018-05-04'))
// console.log(date.compareDate('2007-2-2 7:30', '2007-1-31 8:30'))
// console.log(date.getToday())
// console.log(date.getPreWeekDay(8))
console.log(date.getBetweenDateScope('2018-04-29', '2018-04-29'))
// console.log(c)
