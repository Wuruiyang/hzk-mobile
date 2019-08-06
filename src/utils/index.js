import Axios from 'axios'

// 分装一下百度地图api获取城市的方法
// 1. 如果localStorage里面有,从本地拿,如果没有就从ip拿

// 不会变的常量
const CURRENT_CITY = 'current_city'

// 从本地拿
function getCity() {
  return JSON.parse(localStorage.getItem(CURRENT_CITY))
}
// 存到本地
function setCity(city) {
  localStorage.setItem(CURRENT_CITY, JSON.stringify(city))
}

// 完整的分装的获取城市的方法
export function getCurrentCity() {
  const city = getCity()
  // 如果本地没有,通过百度Api获取
  if (!city) {
    // Promise 解决 return 的问题
    return new Promise((resolve, reject) => {
      const myCity = new window.BMap.LocalCity()
      myCity.get(result => {
        // result里面有城市的name, 城市name获取地理信息
        Axios.get('http://localhost:8080/area/info', {
          params: {
            name: result.name
          }
        })
          .then(res => {
            const { body } = res.data
            setCity(body)
            // 将成功的结果利用promise返回
            resolve(body)
          })
          .catch(err => {
            reject(err)
          })
      })
    })
  } else {
    return Promise.resolve(city)
  }
}
