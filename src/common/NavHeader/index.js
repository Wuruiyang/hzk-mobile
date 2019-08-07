import React from 'react'
import { NavBar } from 'antd-mobile'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import styles from './index.module.scss'
// bug: 自定义的组件不是Route的配置,所以没有history,location,等三大属性
// 解决: 使用高阶组件 withRouter

class NavHeader extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired
  }
  render() {
    return (
      <NavBar
        className={styles.navBar}
        mode="light"
        icon={<i className="iconfont icon-back" />}
        onLeftClick={() => this.props.history.go(-1)}
      >
        {this.props.children}
      </NavBar>
    )
  }
}

export default withRouter(NavHeader)
