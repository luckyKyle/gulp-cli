/***************************
处理Storage相关的一些常规方法
****************************/
export class Storage {
    constructor(key, val) {
        this.key = key
        this.val = val
    }

    /**
     * 设置storage
     * @param {要添加的key名称,String类型} key
     * @param {要添加的value值,Object类型} val
     */
    set(key, val) {
        localStorage.setItem(key, JSON.stringify(val))
    }
    /**
     * 获取storage
     * @param {获取对应key值的storage值,String类型} key
     */
    get(key) {
        return JSON.parse(localStorage.getItem(key))
    }
    /**
     * 移除storage
     * @param {移除对应key值的storage值,String类型} key
     */
    remove(key) {
        localStorage.removeItem(this.key)
    }
      /**
     * 清空所有的storage
     */
    clear() {
        localStorage.clear()
    }
     /**
     * 判断是否有某个指定的storage
     * @param {需要判断的key值,String类型} key
     * @param {如果没有，则添加上该值,String类型} val
     */
    has(key, val) {
        if (!val) {
            return !Object.is(this.get(key), null)
        }
        this.set(key, val)
    }
}

export const Cookie = class {
    constructor(name) {
        this.name = name
    }
    set(key, val) {
        console.log(this)
    }
}
