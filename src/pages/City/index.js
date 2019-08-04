import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import Axios from 'axios'

class City extends React.Component {
  state = {
    cityList: []
  }

  // 这里需要处理成两个数据;
  // cityObj: 按照a-z的顺序,把各个对象放一起
  // shortList: a-z不重复的数组
  formatDate(list) {
    var cityObj = {}
    var shortList = []

    list.forEach(item => {
      // 切割short中的第一项
      const key = item.short.slice(0, 1)
      // key 在 cityObj 中 有没有存在的
      if (key in cityObj) {
        cityObj[key].push(item)
      } else {
        cityObj[key] = [item]
      }
    })
    // 排序. Object.keys 可以遍历所有的key
    shortList = Object.keys(cityObj).sort()
    return {
      cityObj,
      shortList
    }
  }

  async getCityList() {
    const res = await Axios.get('http://localhost:8080/area/city?level=1')
    const { body } = res.data
    console.log(body)
    const { cityObj, shortList } = this.formatDate(body)

    // 获取热门城市,添加至cityList
    const hotRes = await Axios.get('http://localhost:8080/area/hot')
    shortList.unshift('hot')
    cityObj.hot = hotRes.data.body

    console.log(cityObj, shortList)
  }

  componentDidMount() {
    this.getCityList()
  }

  render() {
    return (
      <div className="city">
        {/* 顶部导航栏 */}
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          城市列表
        </NavBar>
      </div>
    )
  }
}

export default City
