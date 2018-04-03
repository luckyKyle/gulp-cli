/***************************
 * 处理Object相关的一些常规方法
 ***************************/

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
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
    if (a === null || a === undefined || b === null || b === undefined) return false
    if (a.prototype !== b.prototype) return false
    let keys = Object.keys(a)
    if (keys.length !== Object.keys(b).length) return false
    return keys.every(k => equals(a[k], b[k]))
}
