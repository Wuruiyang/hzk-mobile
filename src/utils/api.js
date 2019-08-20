import axios from 'axios'
import { BASE_URL } from './config'
import { getToken, removeToken } from './token'

// 配置基础的地址
const API = axios.create({
  baseURL: BASE_URL
})

// 配置响应的请求拦截器
API.interceptors.request.use(config => {
  console.log(config)
  if (
    config.url.startsWith('user') &&
    !config.url.startsWith('user/login') &&
    !config.url.startsWith('user/register')
  ) {
    config.headers.authorization = getToken()
  }
  return config
})

// 配置响应的拦截器
API.interceptors.response.use(
  function(res) {
    if (res.data.status === 400) {
      removeToken()
    }
    return res.data
  },
  function(err) {
    return Promise.reject(err)
  }
)

export { API }
