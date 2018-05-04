/***************************
处理Storage相关的一些常规方法
****************************/

/**
 * 存入Storage
 * @param key 设置指定key值
 * @param val 设置指定value值
 */
export const setStorage = (key, val) => localStorage.setItem(key, JSON.stringify(val))

/**
 * 获取Storage
 * @param key 指定key值
 * @returns  {any}
 */
export const getStorage = (key) => {
    let storageVal = localStorage.getItem(key)
    storageVal = storageVal === 'undefined' ? '' : JSON.parse(storageVal)
    return storageVal
}

/**
 * 判断是否有对应key值的storage， 如果没有返回指定的key值则可以自定义默认值，不设置则返回布尔值
 * @param key 指定key值
 * @param defaultVal
 * @returns Boolean
 */
export const hasStorage = (key, defaultVal) => {
    if (!defaultVal) {
        return !Object.is(getStorage(key), null)
    }
    setStorage(key, defaultVal)
    return getStorage(key) ? getStorage(key) : defaultVal
}

/**
 * 移除指定Storage
 * @param key 移除指定key值
 */
export const removeStorage = (key) => localStorage.removeItem(key)

/**
 * 清空所有Storage数据
 */
export const clearStorage = () => localStorage.clear()
