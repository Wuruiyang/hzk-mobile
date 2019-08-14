// 两个bug
// 1.如果state.swipers没有初始化,那么他无法自动播放
// 解决办法: 添加isLoad,使他在axios之后渲染页面
// 2.控制台一直报错,在你滑动的时候 https://www.jianshu.com/p/04bf173826aa
import React from 'react'
import { API, BASE_URL } from 'utils'
// 已经配置了baseUrl,可以直接到根目录
import Nav1 from 'assets/images/nav-1.png'
import Nav2 from 'assets/images/nav-2.png'
import Nav3 from 'assets/images/nav-3.png'
import Nav4 from 'assets/images/nav-4.png'
import { getCurrentCity } from 'utils'
import { Link } from 'react-router-dom'
import { Carousel, Flex, Grid } from 'antd-mobile'
import SearchHeader from 'common/SearchHeader'

import './index.scss'

// 提取nav
const navList = [
  { title: '整租', img: Nav1, path: '/home/house' },
  { title: '合租', img: Nav2, path: '/home/house' },
  { title: '地图找房', img: Nav3, path: '/map' },
  { title: '去出租', img: Nav4, path: '/rent' }
]

class Index extends React.Component {
  state = {
    swipers: [],
    // 给他增加初始的一个高度,防止闪烁太明显
    imgHeight: 212,
    isLoad: false,
    groups: [],
    messages: [],
    cityName: '北京'
  }

  async getSwipers() {
    const res = await API.get('home/swiper')
    const { status, body } = res
    if (status === 200) {
      // 需要用setState来修改数据
      this.setState({
        swipers: body,
        isLoad: true
      })
    }
  }
  async getGroups() {
    const res = await API.get('home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    const { status, body } = res
    if (status === 200) {
      // 需要用setState来修改数据
      this.setState({
        groups: body
      })
    }
  }
  async getMessages() {
    const res = await API.get('home/news?area=AREA%7C88cff55c-aaa4-e2e0')
    const { status, body } = res
    if (status === 200) {
      // 需要用setState来修改数据
      this.setState({
        messages: body
      })
    }
  }
  // 发送axios,获取数据
  async componentDidMount() {
    this.getSwipers()
    this.getGroups()
    this.getMessages()

    // 调用百度地图的api,获取当前城市
    const body = await getCurrentCity()
    // console.log(body)
    this.setState({
      cityName: body.label
    })
    // })
  }

  // 渲染swipers
  renderSwipers() {
    return (
      //  autoplay: 自动播放
      //  infinite: 持续播放
      this.state.isLoad && (
        <Carousel autoplay infinite>
          {this.state.swipers.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: 'inline-block',
                width: '100%',
                height: this.state.imgHeight
              }}
            >
              <img
                src={`${BASE_URL}${item.imgSrc}`}
                alt=""
                style={{ width: '100%', verticalAlign: 'top' }}
                //
                onLoad={() => {
                  window.dispatchEvent(new Event('resize'))
                  this.setState({ imgHeight: 'auto' })
                }}
              />
            </a>
          ))}
        </Carousel>
      )
    )
  }

  // 渲染nav 使用flex布局
  // 注意点: 图片的地址需要用import引入
  renderNav() {
    return (
      <Flex>
        {navList.map(item => (
          <Flex.Item key={item.title}>
            <Link to={item.path}>
              <img src={item.img} alt="" />
              <p>{item.title}</p>
            </Link>
          </Flex.Item>
        ))}
      </Flex>
    )
  }

  // 渲染group
  renderGroup() {
    return (
      <>
        <h3 className="group-title">
          租房小组
          <span className="more">更多</span>
        </h3>
        <div className="group-content">
          {/* 
            参数: 
            data: 需要渲染的数据,是一个数组
            activeStyle: 点击的样式
            square: 是否固定为正方形

            Grid的renderItem是可以遍历数组的,不用key
          */}
          <Grid
            data={this.state.groups}
            activeStyle
            hasLine={false}
            columnNum={2}
            square={false}
            renderItem={item => (
              <Flex className="group-item" justify="around">
                <div className="desc">
                  <p className="title">{item.title}</p>
                  <span className="info">{item.desc}</span>
                </div>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
      </>
    )
  }

  // 渲染资讯列表
  renderMessage() {
    return (
      <>
        <h3 className="message-title">最新资讯</h3>
        {this.state.messages.map(item => (
          <div key={item.id} className="news-item">
            <div className="imgwrap">
              <img src={`${BASE_URL}${item.imgSrc}`} alt="" className="img" />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </>
    )
  }

  // 搜索渲染
  renderSearch() {
    return <SearchHeader cityName={this.state.cityName} />
  }

  render() {
    return (
      <div className="index">
        {/* 轮播图 */}
        <div className="swiper" style={{ height: this.state.imgHeight }}>
          {this.renderSearch()}
          {this.renderSwipers()}
        </div>
        {/* 导航 */}
        <div className="nav">{this.renderNav()}</div>
        {/* 租房小组 */}
        <div className="group">{this.renderGroup()}</div>
        {/* 最新资讯 */}
        <div className="message">{this.renderMessage()}</div>
      </div>
    )
  }
}
export default Index
