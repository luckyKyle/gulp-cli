/***************************
处理Date相关的一些常规方法
***************************/

/**
 * Usage: HH:MM:SS 时间格式的快速获取
 * @param {传入日期对象} str
 * Example: getColonTimeFromDate(new Date()) -> "18:04:00"
 */
export const getColonTimeFromDate = date => date.toTimeString().slice(0, 8)
