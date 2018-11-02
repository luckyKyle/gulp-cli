import { baseUrl, ERROR_OK } from './config'
class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.def = $.Deferred()
  }
  post(url, data) {
    url = this.baseUrl + url
    $.post(url, data).then(data => this.def.resolve(data))
    return this.def
  }
  get(url, data) {
    url = this.baseUrl + url
    $.get(url, data).then(data => this.def.resolve(data))
    return this.def
  }
  jsonp(url, data) {
    $.ajax({
      url: this.baseUrl + url,
      type: 'get',
      dataType: 'jsonp',
      jsonp: 'callback',
      data: data
    }).then(res => {
      if (res.code !== ERROR_OK) {
        this.def.reject(res)
      }
      this.def.resolve(res)
    })
    return this.def
  }

  // 公共参数
  baseParams(params) {
    const base = {
      // do something
    }
    return Object.assign(base, params)
  }
}

export default new Api(baseUrl)
