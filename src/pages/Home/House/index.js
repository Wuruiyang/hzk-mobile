// 完成了HouseItem的渲染以后,往下划需要在没有到达底部时
// 发送axios,继续渲染
import React from 'react'
import SearchHeader from 'common/SearchHeader'
import styles from './index.module.scss'
import { Flex, Toast } from 'antd-mobile'
import Filter from './Filter'
import { getCurrentCity, API } from 'utils'
import {
  List,
  AutoSizer,
  WindowScroller,
  InfiniteLoader
} from 'react-virtualized'
// windowScroller 用来全屏滚动
// InfiniteLoader 可以在接近底部的时候发送axios,持续滚动
import HouseItem from 'common/HouseItem'
import Sticky from 'common/Sticky'
import NoHouse from 'common/NoHouse'

class House extends React.Component {
  state = {
    filters: {},
    list: [],
    count: 0,
    currentLabel: '',
    currentValue: '',
    isFirst: true
  }
  async getAndSetCity() {
    const res = await getCurrentCity()
    this.setState({
      currentLabel: res.label,
      currentValue: res.value
    })
  }
  async componentDidMount() {
    await this.getAndSetCity()
    // 发送ajax请求
    await this.getHouseList()
  }
  onFileter = values => {
    const filters = this.formatFilters(values)
    this.setState(
      {
        filters
      },
      // 在setState后发送ajax
      () => {
        this.getHouseList()
      }
    )

    // 滚动到顶部,使用scrollTo(x,y)
    window.scrollTo(0, 0)
  }
  // 处理Filter传过来的数据,做成理想的样子
  formatFilters(values) {
    const filters = {}
    // console.log(values)
    filters.price = values.price[0]
    filters.rentType = values.mode[0]
    filters.more = values.more.join()
    // 处理area的数据
    const area = values.area
    const type = area[0]
    // console.log(type)
    let value
    if (area.length === 2) {
      value = area[1]
    } else {
      // area的长度为3,判断第3项的值是否是'null'
      value = area[2] === 'null' ? area[1] : area[2]
    }
    filters[type] = value
    return filters
  }
  // axios 根据条件获取对应的房屋数据
  getHouseList = async (start = 1, end = 30) => {
    Toast.loading('加载中...', 0)
    console.log(this.state)
    // const { value } = await getCurrentCity()
    const res = await API.get('houses', {
      params: {
        cityId: this.state.currentValue,
        ...this.state.filters,
        start,
        end
      }
    })

    // console.log(res)
    const { list, count } = res.body

    this.setState({
      count,
      list: [...this.state.list, ...list],
      isFirst: false
    })
    Toast.hide()
    if (start === 1) {
      Toast.info(`总共找到了${count}套房源`, 1)
    }
  }

  // rowRenderer是List组件提供的 专门用来渲染row的内容
  // key:
  rowRenderer({ key, index, style }) {
    const item = this.state.list[index]
    // console.log(item, key)
    // 判断item是否有值,如果没有的话就提示,并且不渲染内容
    if (!item) {
      return (
        <div key={key} style={style} className="tips">
          <p />
        </div>
      )
    }
    return <HouseItem key={key} item={item} style={style} />
  }

  // 这里控制是否需要加载下面的数据
  isRowLoaded({ index }) {
    // 判断list中index是否有对应的数据
    return !!this.state.list[index]
  }

  // 需要加载更多时
  // 这里发送ajax请求，获取更多的数据
  loadMoreRows({ startIndex, stopIndex }) {
    console.log('没有数据了，该发送请求了', startIndex, stopIndex)
    return new Promise(async resolve => {
      await this.getHouseList(startIndex + 1, stopIndex + 1)
      resolve()
    })
  }

  renderHouseList() {
    // 如果count===0,渲染<NoHouse>
    // 否则 渲染 房子
    // bug: 在刚开始加载页面时count=0,会出现<NoHouse>
    const { count, isFirst } = this.state
    if (count === 0 && !isFirst) {
      return <NoHouse />
    }
    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded.bind(this)}
        loadMoreRows={this.loadMoreRows.bind(this)}
        rowCount={count}
        minimumBatchSize={30}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    autoHeight
                    width={width}
                    height={height}
                    rowCount={count}
                    rowHeight={120}
                    rowRenderer={this.rowRenderer.bind(this)}
                    isScrolling={isScrolling}
                    scrollTop={scrollTop}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    const { currentLabel } = this.state
    return (
      <div className={styles.house}>
        <Flex className="house-title">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader className="house-search" cityName={currentLabel} />
        </Flex>

        <Sticky>
          <Filter onFileter={this.onFileter} />
        </Sticky>

        {this.renderHouseList()}
      </div>
    )
  }
}

export default House
