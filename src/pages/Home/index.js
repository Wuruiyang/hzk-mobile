import React from 'react'
import { Route } from 'react-router-dom'
import Index from './Index/index.js'
import House from './House/index.js'
import News from './News/index.js'
import My from './My/index.js'
import './index.scss'

import { TabBar } from 'antd-mobile'

// 提供tabBar的信息
const itemList = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/house' },
  { title: '咨询', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/my' }
]

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 对应下面的selectTab,默认选中的tab栏
      // 这个值从地址栏中获取
      // selectedTab === selectedIcon 就会高亮
      selectedTab: props.location.pathname
    }
  }
  // 点击tabBar的时候页面发生更新,需要重新渲染state
  componentDidUpdate(prevProps) {
    // console.log(prevProps.location.pathname)
    // console.log(this.props.location.pathname)
    // 在更新的地方setState会重复更新
    // 前一次的地址,和当前的地址一样时就会更新 setState()
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  /*
  title: 显示的文字
  icon: 未选中的文字
  selectedIcon: 选中的图标
  selected: 是否被选中
  badge: 上面的小角标 badge={1}
  onPress: 点击的事件
  icon:  一个jsx
  */
  renderBar() {
    return itemList.map(item => (
      <TabBar.Item
        title={item.title}
        key={item.title}
        icon={<i className={`iconfont ${item.icon}`} />}
        selectedIcon={<i className={`iconfont ${item.icon}`} />}
        selected={this.state.selectedTab === item.path}
        onPress={() => {
          // 当按下的时候跳转页面取path的地方
          this.props.history.push(item.path)
        }}
      />
    ))
  }

  render() {
    return (
      <div className="home">
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
        <TabBar
          className="tabBar"
          // unselectedTintColor	未选中的字体颜色
          // tintColor	选中的字体颜色
          unselectedTintColor="#888"
          tintColor="#21b97a"
          barTintColor="white"
          hidden={this.state.hidden}
        >
          {this.renderBar()}
        </TabBar>
      </div>
    )
  }
}

export default Home
