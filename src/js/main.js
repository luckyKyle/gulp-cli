// import { filterNonUnique } from './util/array'
import * as storage from './util/storage'
import * as date from './util/date'
import * as string from './util/string'
import * as array from './util/array'
import * as is from './util/is'
import * as util from './util/util'
import * as object from './util/object'

import 'babel-polyfill'

let a = {
  a1: '111',
  a2: 222
}
let b = {
  b1: 333,
  b2: 444
}
let c = Object.assign(a, b)

let btn1 = document.querySelector('#btn1') // 设置
let btn2 = document.querySelector('#btn2') // 获取
let btn3 = document.querySelector('#btn3') // 判断
let btn4 = document.querySelector('#btn4') // 移除
let btn5 = document.querySelector('#btn5') // 清空

btn1.onclick = function () {
  storage.set('test', c)
}
btn2.onclick = function () {
  console.log(storage.get('test'))
}

btn3.onclick = function () {
  console.log(storage.has('test'))
}

btn4.onclick = function () {
  console.log(storage.remove('test'))
}

btn5.onclick = function () {
  console.log(storage.clear())
}

console.log(date)
console.log(string)
console.log(object)
console.log(util)
console.log(is.reg)
console.log(array.getProperties([{ key1: 'aaa', key2: 'bbb' }, { key1: 'AAA', key2: 'BBB' }], 'key1'))

window.addEventListener('resize', util.debounce(() => {
    console.log(window.innerWidth)
    console.log(window.innerHeight)
}, 1000))

util.debounce(() => {
    console.log('生效')
}, 2000)

console.log(date.getColonTimeFromDate())
console.log(date.getDaysDiffBetweenDates('2018-05-05', '2018-05-14'))
console.log(date.timestampToTime(1489525200000))
console.log(date.dateToWeek('2018-05-04'))
console.log(date.compareDate('2018-05-04', '2018-05-14'))
console.log(date.getToday())
console.log(date.getPreWeekDay(8))
console.log(date.getBetweenDateScope('2018-04-29', '2018-04-29'))
console.log(date.getPreMontAllDate(2))
console.log(date.getDateRange(2))
console.log(date.getPreWeeks(2))
console.log(date.getWeekStartEnd('2018-05-05'))
console.log(date.getMonthStartEnd('2018-05-05'))
