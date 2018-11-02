import api from './api'

export const getNews = (params) => api.get('orderList', params)
