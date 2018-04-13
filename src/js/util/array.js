/***************************
 * 处理Array相关的一些常规方法
***************************/

/**
 * Usage: 返回数组中的最大值
 * @param {需要传入的数组} arr
 * Example:  arrayMax([10, 1, 5]) -> 10
 */
export const arrayMax = arr => Math.max(...arr)

/**
 * Usage: 返回数组中的最小值
 * @param {需要传入的数组} arr
 * Example: arrayMax([10, 1, 5]) arrayMin([10, 1, 5]) -> 1
 */
export const arrayMin = arr => Math.min(...arr)

/**
 * Usage: 从数组中移除falsey值 (使用Array.filter()筛选出 falsey 值 (false、null、 0、 ""、undefined和NaN).)
 * @param {需要传入的数组} arr
 * Example:  arrayMax([10, 1, 5]) arrayMin([10, 1, 5]) -> 1
 */
export const compact = arr => arr.filter(Boolean)

/**
 * Usage: 计算数组中值的出现次数 (使用Array.reduce()在每次遇到数组中的特定值时递增计数器)
 * @param {需要传入的数组} arr
 * @param {需要传入的数组} value
 * Example:   countOccurrences([1,1,2,1,2,3], 1)  -> 3
 */
export const countOccurrences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0)

/**
 * Usage:深拼合数组
 * @param {需要传入的数组} arr
 * Example: deepFlatten([1,[2],[[3],4],5]) -> [1,2,3,4,5]
 */
export const deepFlatten = arr => [].concat(...arr.map(v => Array.isArray(v) ? deepFlatten(v) : v))

/**
 * Usage:返回两个数组之间的差异
 * @param {需要传入的数组a} a
 * @param {需要传入的数组b} b
 * @return 返回一个数组，包含差异值
 * Example: difference([1,2,3], [1,2,4]) -> [3]
 */
export const difference = (a, b) => { const s = new Set(b); return a.filter(x => !s.has(x)) }

/**
 * Usage: 将数组块划分为指定大小的较小数组
 * @param {需要传入的数组} arr
 * @param {指定粒度长度} length
 * Example: chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 */
export const chunk = (arr, length) =>
    Array.from({ length: Math.ceil(arr.length / length) }, (v, i) => arr.slice(i * length, i * length + length))

/**
 * Usage: 数组去重，返回数组的所有不同值
 * @param {需要传入的数组a} arr
 * @return 返回一个数组，包含去重结果
 * Example: distinctValuesOfArray([1,2,2,3,4,4,5]) -> [1,2,3,4,5]
 */
export const distinctValuesOfArray = arr => [...new Set(arr)]

/**
 * Usage: 数组筛选，返回满足某个指定条件
 * @param {需要传入的数组} arr
 * @param {需要满足的条件} func
 * @return 返回一个数组，包含满足指定条件的条件
 * Example:  dropElements([1, 2, 3, 4], n => n >= 3) -> [3,4]
 */
export const dropElements = (arr, func) => {
    return arr.filter(func)
}

/**
 * Usage: 返回数组中的每个第 n 个元素
 * @param {需要传入的数组} arr
 * @param {指定的除数} nth
 * @return 返回一个数组，包含满足被二参整除
 * Example:  everyNth([1,2,3,4,5,6], 2) -> [ 1, 3, 5 ]
 */
export const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === 0)

/**
 * Usage: 筛选出数组中的唯一值。
 * @param {需要传入的数组} arr
 * @return 返回一个数组，包含满足指定条件的条件
 * Example: filterNonUnique([1,2,2,3,4,4,5]) -> [1,3,5]
 */
export const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i))

/**
 * Usage: 拼合一个二维数组。
 * @param {需要传入的数组} arr
 * @return 返回一个数组，包含满足指定条件的条件
 * Example: flatten([1,[2],3,4]) -> [1,2,3,4]
 */
export const flatten = arr => arr.reduce((a, v) => a.concat(v), [])

/**
 * Usage: 拼合一个二维数组。
 * @param {需要传入的数组} arr
 * @return 返回一个数组，包含满足指定条件的条件
 * Example: flattenDepth([1,[2],[[[3],4],5]], 2) -> [1,2,[3],4,5]
 */
export const flattenDepth = (arr, depth = 1) => depth !== 1 ? arr.reduce((a, v) => a.concat(Array.isArray(v) ? flattenDepth(v, depth - 1) : v), []) : arr.reduce((a, v) => a.concat(v), [])

/**
 * Usage: 根据给定函数对数组元素进行分组。
 * @param {需要传入的数组} arr
 * @param {需要传入的函数} func
 * @return 返回一个对象，
 * Example_1: groupBy([6.1, 4.2, 6.3], Math.floor) -> {4: [4.2], 6: [6.1, 6.3]}
 * Example_2: groupBy(['one', 'two', 'three'], 'length') -> {3: ['one', 'two'], 5: ['three']}
 */
export const groupBy = (arr, func) => arr.map(typeof func === 'function' ? func : val => val[func]).reduce((acc, val, i) => { acc[val] = (acc[val] || []).concat(arr[i]); return acc }, {})

/**
 * Usage: 返回除最后一个数组之外的所有元素。
 * @param {需要传入的数组} arr
 * @return initial([1,2,3]) -> [1,2]
*/
export const initial = arr => arr.slice(0, -1)

/**
 * Usage: 返回列表的首位
 * @param {需要传入的数组} arr
 * @return head([1,2,3]) -> [1,2]
 * Example: head([1,2,3]) -> 1
*/
export const head = arr => arr[0]
