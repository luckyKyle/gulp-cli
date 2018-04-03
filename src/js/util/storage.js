/***************************
处理Storage相关的一些常规方法
****************************/

export const setStorage = (key, val) => {
    localStorage.setItem(key, JSON.stringify(val))
}

export const getStorage = key => JSON.parse(localStorage.getItem(key))

export const removeStorage = key => localStorage.removeItem(key)

export const clearStorage = () => {
    localStorage.clear()
}

export const hasStorage = (key, defaultVal) => {
    if (!defaultVal) {
        return getStorage(key)
    }
    return this.getStorage(key) ? getStorage(key) : defaultVal
}
