export class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }
    post(url, data) {
        let def = $.Deferred()
        $.post(url, data).then(data => def.resolve(data))
        return def
    }
    get(url, data) {
        let def = $.Deferred()
        $.get(url, data).then(data => def.resolve(data))
        return def
    }
    jsonp(url, data) {
        let def = $.Deferred()
        $.ajax({
            url: baseUrl + url,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            data: data
        }).then(res => {
            if (res.code === 10000) {
                def.resolve(res)
            } else {
                layer.alert(res.msg)
                def.reject(res)
            }
        })
        return def
    }

    baseParams(params) {
        const base = {
            // do something
        }
        return Object.assign(base, params)
    }

    print(val) {
        return (val + "一些代码测试文字")
    }

}