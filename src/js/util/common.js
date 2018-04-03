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
 * Usage: 获取url上的参数
 * @param {需要传入的url} url
 * @return Object  {key:value}
 * Example: getURLParameters('http://url.com/page?name=Adam&surname=Kyle') -> {name: 'Adam', surname: 'Kyle'}
 */
export const getURLParameters = url =>
    (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(
        (a, v) => ((a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1)), a), {}
    )

/**
 * Usage: promisify
 * @param {} func
 * @return Object  {}
 * Example: const delay = promisify((d, cb) => setTimeout(cb, d))
            delay(2000).then(() => console.log('Hi!'))  -> Promise resolves after 2s
 */
export const promisify = func => (...args) =>
    new Promise((resolve, reject) =>
        func(...args, (err, result) => (err ? reject(err) : resolve(result)))
    )
