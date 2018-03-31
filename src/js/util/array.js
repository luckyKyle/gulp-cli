/*--------------------------------
处理Array相关的一些常规方法
---------------------------------*/

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
 * @param {指定大小} size 
 * Example: chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 */
export const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

/**
 * Usage: 数组去重，返回数组的所有不同值
 * @param {需要传入的数组a} arr
 * @return 返回一个数组，包含去重结果
 * Example: distinctValuesOfArray([1,2,2,3,4,4,5]) -> [1,2,3,4,5]
 */
export const distinctValuesOfArray = arr => [...new Set(arr)]