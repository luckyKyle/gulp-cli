/***************************
处理Date相关的一些常规方法
***************************/

/**
 * Usage: HH:MM:SS 时间格式的快速获取
 * @param {传入日期对象} str
 * Example: getColonTimeFromDate(new Date()) -> "18:04:00"
 */
export const getColonTimeFromDate = date => date.toTimeString().slice(0, 8)

/**
 * Usage: 返回两个日期之间的差异 (以天为值)。
 * "计算Date对象之间的差异 (以天为单位)。"
 * @param {传入日期对象} obj
 * Example: getDaysDiffBetweenDates(new Date("2017-12-13"), new Date("2017-12-22")) -> 9
 */
export const getDaysDiffBetweenDates = (dateInitial, dateFinal) => (dateFinal - dateInitial) / (1000 * 3600 * 24)

/**
 * Usage: 将 JSON 对象转换为日期。
 * "使用Date(), 将 JSON 格式的日期转换为可读格式 (dd/mm/yyyy日))."
 * @param {传入日期对象} obj
 * Example: JSONToDate(/Date(1489525200000)/) -> "14/3/2017"
 */
export const JSONToDate = arr => {
    const dt = new Date(parseInt(arr.toString().substr(6)))
    return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`
}
