import React from 'react'
import SearchHeader from 'common/SearchHeader'
import styles from './index.module.scss'
import { Flex } from 'antd-mobile'
import Filter from './Filter'
class House extends React.Component {
  render() {
    return (
      <div className={styles.house}>
        <Flex className="house-title">
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          <SearchHeader className="house-search" cityName="上海" />
        </Flex>

        <Filter />
      </div>
    )
  }
}

export default House
