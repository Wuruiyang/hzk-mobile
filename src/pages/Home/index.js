import React from 'react'
import { Route } from 'react-router-dom'
import Index from './Index/index'
import House from './House'
import News from './News'
import My from './My'
import './index.scss'
import { TabBar } from 'antd-mobile'

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'redTab',
      hidden: false,
      fullScreen: false
    }
  }
  render() {
    return (
      <div className="home">
        <Route path="/home/index" component={Index} />
        <Route path="/home/house" component={House} />
        <Route path="/home/news" component={News} />
        <Route path="/home/my" component={My} />
      </div>
    )
  }
}

export default Home
