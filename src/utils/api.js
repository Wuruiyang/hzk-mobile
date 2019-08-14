import axios from 'axios'
import { BASE_URL } from './config'

// 配置基础的地址
const API = axios.create({
  baseURL: BASE_URL
})

// 配置响应的拦截器
API.interceptors.response.use(
  function(res) {
    return res.data
  },
  function(err) {
    return Promise.reject(err)
  }
)

export { API }
