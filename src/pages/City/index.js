import React from 'react'
import { NavBar, Icon } from 'antd-mobile'
import Axios from 'axios'
import { getCurrentCity } from 'utils'
import { List, AutoSizer } from 'react-virtualized'
import {} from './index.scss'
const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50
class City extends React.Component {
  state = {
    cityObj: {},
    shortList: [],
    currentIndex: 0
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
    // console.log(body)
    const { cityObj, shortList } = this.formatDate(body)

    // 获取热门城市,添加至cityList
    const hotRes = await Axios.get('http://localhost:8080/area/hot')
    shortList.unshift('hot')
    cityObj.hot = hotRes.data.body

    // 获取当前城市,  从utils导入
    const city = await getCurrentCity()
    shortList.unshift('#')
    cityObj['#'] = [city]
    this.setState({
      cityObj,
      shortList
    })

    console.log(cityObj, shortList)
  }

  componentDidMount() {
    this.getCityList()
  }

  // 每一行的内容,一行是一个字母和该字母下面的内容
  rowRenderer({ key, index, style }) {
    // 通过下标获取shortList的首字母
    const letter = this.state.shortList[index]
    // 根据首字母获取到需要渲染的城市列表
    const list = this.state.cityObj[letter]
    // console.log(list)
    return (
      <div key={key} style={style} className="city-item">
        <div className="title">{this.formatTitle(letter)}</div>
        {list.map(item => (
          <div key={item.value} className="name">
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  formatTitle(letter) {
    if (letter === '#') {
      return '当前定位'
    } else if (letter === 'hot') {
      return '热门城市'
    } else {
      return letter.toUpperCase()
    }
  }
  // 计算每一row的高度
  calHeight({ index }) {
    const letter = this.state.shortList[index]
    const count = this.state.cityObj[letter].length
    return TITLE_HEIGHT + count * CITY_HEIGHT
  }

  // 右侧的列表渲染
  renderRightMenu() {
    return (
      <ul className="city-index">
        {this.state.shortList.map((item, index) => (
          <li className="city-index-item" key={item}>
            <span
              className={
                index === this.state.currentIndex ? 'index-active' : ''
              }
            >
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))}
      </ul>
    )
  }
  // 获取当前的高亮
  // startIndex: 表示第几行显示出来了
  // bug: onRowsRendered无法展示,需要在List组件里面,增加一个配置
  onRowsRendered({ startIndex }) {
    if (this.state.currentIndex !== startIndex) {
      this.setState({
        currentIndex: startIndex
      })
    }
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

        {/* 城市列表的渲染  react-virtualized */}
        {/* 
          参数: 
            List: 长列表组件
            width: 长列表的宽度(显示)
            height: 长列表的高度(显示)
            rowCount: 显示数据的条数(必须)
            rowHeight: 每行的高度
            rowRenderer: 控制每一行具体的渲染的内容 render props
        */}
        <AutoSizer>
          {({ width, height }) => (
            <List
              width={width}
              height={height}
              rowCount={this.state.shortList.length}
              rowHeight={this.calHeight.bind(this)}
              rowRenderer={this.rowRenderer.bind(this)}
              onRowsRendered={this.onRowsRendered.bind(this)}
            />
          )}
        </AutoSizer>

        {/* 右侧的快捷菜单 */}
        {this.renderRightMenu()}
      </div>
    )
  }
}

export default City
