/**
 * Usage:回到顶部，优点使用浏览器刷新频率的requestAnimationFrame，很顺滑
 * Example: scrollToTop()
 */

export const scrollToTop = () => {
    const s = document.documentElement.scrollTop || document.body.scrollTop
    if (s > 0) {
        window.requestAnimationFrame(scrollToTop)
        window.scrollTo(0, s - s / 8)
    }
}

/**
 * Usage:复制到黏贴版
 * @param {传入字符串对应} str 
 * Example: copyToClipboard('success!')
 */
export const copyToClipboard = str => {
    const el = document.createElement('textarea')
    el.value = str
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    const selected =
        document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    if (selected) {
        document.getSelection().removeAllRanges()
        document.getSelection().addRange(selected)
    }
}

/**
 * Usage: HH:MM:SS 时间格式的快速获取
 * @param {传入日期对象} str 
 * Example: getColonTimeFromDate(new Date()) -> "18:04:00"
 */
export const getColonTimeFromDate = date => date.toTimeString().slice(0, 8)

/**
 * Usage: 定时器防抖动
 * @param {回调函数} fn 
 * @param {延时时长} ms 
 * Example:  window.addEventListener( 'resize', debounce(() => { console.log(window.innerWidth) console.log(window.innerHeight) }, 250) )
 */
export const debounce = (fn, ms = 0) => {
    let timeoutId
    return function(...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => fn.apply(this, args), ms)
    }
}

/**
 * Usage: 对象深度对比判断相等
 * @param {回调函数} fn 
 * @param {延时时长} ms 
 * @return Boolean 
 * Example:  equals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' }) -> true
 */
export const equals = (a, b) => {
    if (a === b) return true
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
    if (!a || !b || (typeof a != 'object' && typeof b !== 'object')) return a === b
    if (a === null || a === undefined || b === null || b === undefined) return false
    if (a.prototype !== b.prototype) return false
    let keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) return false
    return keys.every(k => equals(a[k], b[k]))
}

/**
 * Usage: 获取url上的参数
 * @param {需要传入的url} url 
 * @return Object  {}
 * Example: getURLParameters('http://url.com/page?name=Adam&surname=Kyle') -> {name: 'Adam', surname: 'Kyle'}
 */

export const getURLParameters = url =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {}
    )

/**
 * Usage: promisify
 * @param {需要传入的url} url 
 * @return Object  {}
 * Example: const delay = promisify((d, cb) => setTimeout(cb, d))
            delay(2000).then(() => console.log('Hi!'))  -> Promise resolves after 2s
 */
export const promisify = func => (...args) =>
    new Promise((resolve, reject) =>
        func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    )

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
 * Usage: 将数组块划分为指定大小的较小数组
 * @param {需要传入的数组} arr 
 * @param {指定大小} size 
 * Example: chunk([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]
 */
export const chunk = (arr, size) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size))

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
 * Usage: 去重，返回数组的所有不同值
 * @param {需要传入的数组a} arr
 * @return 返回一个数组，包含去重结果
 * Example: distinctValuesOfArray([1,2,2,3,4,4,5]) -> [1,2,3,4,5]
 */
export const distinctValuesOfArray = arr => [...new Set(arr)]