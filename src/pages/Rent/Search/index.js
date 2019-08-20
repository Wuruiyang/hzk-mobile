import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

// import { getCity } from 'utils'

import styles from './index.module.scss'
import { API, getCurrentCity } from 'utils'

export default class Search extends Component {
  // 当前城市id
  // cityId = getCity().value

  state = {
    // 搜索框的值
    searchTxt: '',
    tipsList: []
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map(item => (
      <li key={item.community} className="tip">
        {item.communityName}
      </li>
    ))
  }

  onChange = async name => {
    this.setState({
      searchTxt: name
    })
    const { value: id } = await getCurrentCity()
    const res = await API.get('area/community', {
      params: {
        name,
        id
      }
    })
    if (res.status === 200) {
      this.setState({
        tipsList: res.body
      })
    }
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles['rent-search']}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onCancel={() => history.replace('/rent/add')}
          onChange={this.onChange}
        />

        {/* 搜索提示列表 */}
        <ul className="tips">{this.renderTips()}</ul>
      </div>
    )
  }
}
