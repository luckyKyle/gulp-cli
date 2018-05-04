/***************************
处理Date相关的一些常规方法
***************************/

/**
 * Usage: 时间格式的快速获取 HH:MM:SS
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
 * 十位补零
 * @param num (Number)
 * @returns padTime(0) -> '00'
 */
export const padTime = (num) => num < 10 ? '0' + num : num

/**
 * Usage: 将时间戳转换为日期
 * "使用Date(), 将时间戳转换转换为可读格式)."
 * @param {传入的时间戳} timestamp
 * @param {布尔值是否需要时钟} needTime
 * @param {返回的格式 (yyyy-mm-dd或者dd/mm/yyyy )} type
 * Example: timestampToTime(1489525200000, true) -> "2017-03-15 05:00:00"
 */
export const timestampToTime = (timestamp, needTime = false, format = 1) => {
    let date = new Date(timestamp)
    let Y = date.getFullYear()
    let M = padTime(date.getMonth() + 1)
    let D = padTime(date.getDate())
    let h = padTime(date.getHours())
    let m = padTime(date.getMinutes())
    let s = padTime(date.getSeconds())

    switch (format) {
        case 1:
            return needTime ? `${Y}-${M}-${D} ${h}:${m}:${s}` : `${Y}-${M}-${D}`
        case 2:
            return needTime ? `${D}/${M}/${Y} ${h}:${m}:${s}` : `${D}/${M}/${Y}`
    }
}

/**
 * Usage: 将为日期转换时间戳
 */
export const timeTotimestamp = date => Date.parse(date)

/**
 * Usage: 根据日期返回星期几
 * @param {传入的日期} dateString
 * Example: dateToWeek('2018-05-04') -> "星期五"
 */
export const dateToWeek = dateString => {
    let date
    if (dateString !== null || typeof dateString !== 'undefined') {
        date = new Date()
    } else {
        let dateArray = dateString.split('-')
        date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2])
    }
    return '星期' + '日一二三四五六'.charAt(date.getDay())
}

/**
 * 比较两个日期大小,如果1参早于2参则为true
 * @param {any} d1  较晚的日期 "2007-2-2 7:30"
 * @param {any} d2  较早的日期"2007-1-31 8:30"
 * @returns Boolean
 * Example: compareDate('2007-2-2 7:30', '2007-1-31 8:30') -> true
 */
export const compareDate = (d1, d2) => {
    d1 = new Date(d1.replace(/-/g, '\'/'))
    d2 = new Date(d2.replace(/-/g, '\'/'))
    return d1 > d2
}

/**
 * 获取今天的日期
 * @returns '2018-05-04'
 * Example: getToday() -> '2018-05-04'
 */
export const getToday = () => {
    let day = new Date()
    day.setTime(day.getTime())
    return day.getFullYear() + '-' + padTime((day.getMonth() + 1)) + '-' + padTime(day.getDate())
}

/**
 * 获取上一周的日期,默认前7天的
 * @param {前几天的} pre
 * @returns '2018-05-04'
 * Example: getPreWeekDay() -> '2018-04-27'
 */
export const getPreWeekDay = (pre = 7) => {
    let now = new Date()
    let oneWeekTime = pre * 24 * 60 * 60 * 1000
    let lastWeekDay = new Date(now - oneWeekTime)
    return lastWeekDay.getFullYear() + '-' + padTime((lastWeekDay.getMonth() + 1)) + '-' + padTime(lastWeekDay.getDate())
}

/**
 * 获取两个日期范围
 * @param start: 开始时间(string:“2018-11-11”)
 * @param end: 结束时间(string:“2018-11-15”)
 * @returns 返回包含起止日期之间的所有日期的数组
 * Example: getBetweenDateScope('2018-04-27','2018-04-29') -> ["2018-04-27", "2018-04-28", "2018-04-29"]
 */
export const getBetweenDateScope = (start, end) => {
    start = timeTotimestamp(start) // 将日期转为时间戳
    end = timeTotimestamp(end) // 将日期转为时间戳
    let oneDay = 24 * 60 * 60 * 1000
    let arr = []

    if (start > end) throw Error('1参日期晚于2参日期')
    for (let i = start; i <= end;) {
        arr.push(timestampToTime(i))
        i += oneDay
    }
    return arr
}
