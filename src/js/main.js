import * as a from './moudules/a'
import * as api from './api'
/* eslint-disable */
const getOrder = () => {
  let container = $('#container')
  api.getNews().then(res => {
    const data = res.data
    console.log('a', a)
    console.log(data.order)
  })
}
getOrder()