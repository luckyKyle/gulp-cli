import * as a from './moudules/a'
import * as api from './api'
const getOrder = () => {
  let container = $('#container')
  api.getNews().then(res => {
    const data = res.data
    console.log('a', a)
    container.html(window.template('tplOrdertList', data.order))
  })
}
getOrder()
