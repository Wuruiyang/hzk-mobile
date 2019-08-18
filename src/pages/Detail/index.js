import React, { Component } from 'react'
import { API, BASE_URL } from 'utils'
import NavHeader from 'common/NavHeader'
import styles from './index.module.scss'
import { Carousel, Flex } from 'antd-mobile'
import classnames from 'classnames'
export default class Detail extends Component {
  state = {
    houseInfo: null
  }
  async componentDidMount() {
    const id = this.props.match.params.id
    const res = await API.get(`houses/${id}`)
    console.log(res)
    this.setState({
      houseInfo: res.body
    })
  }
  // 渲染标签
  renderTags(tags) {
    return tags.map((item, index) => {
      // 如果标签数量超过3个，后面的标签就都展示位第三个标签的样式
      let tagClass = ''
      if (index > 2) {
        tagClass = 'tag3'
      } else {
        tagClass = 'tag' + (index + 1)
      }

      return (
        <span key={item} className={classnames('tag', tagClass)}>
          {item}
        </span>
      )
    })
  }
  render() {
    const { houseInfo } = this.state
    if (!houseInfo) {
      return null
    }
    const {
      community,
      houseImg,
      title,
      price,
      roomType,
      size,
      floor,
      oriented,
      tags
    } = houseInfo
    return (
      <div className={styles.detail}>
        <NavHeader
          className="navHeader"
          rightContent={[<i key="share" className="iconfont icon-share" />]}
        >
          {community}
        </NavHeader>

        {/* 轮播图 */}
        <div className="slides">
          <Carousel autoplay infinite>
            {houseImg.map(item => (
              <a key={item} href="http://www.alipay.com">
                <img src={`${BASE_URL}${item}`} alt="" />
              </a>
            ))}
          </Carousel>
        </div>
        {/* 房屋基础信息 */}
        <div className="info">
          <h3 className="infoTitle">{title}</h3>
          <Flex className="tags">
            <Flex.Item>{this.renderTags(tags)}</Flex.Item>
          </Flex>

          <Flex className="infoPrice">
            <Flex.Item className="infoPriceItem">
              <div>
                {price}
                <span className="month">/月</span>
              </div>
              <div>租金</div>
            </Flex.Item>
            <Flex.Item className="infoPriceItem">
              <div>{roomType}</div>
              <div>房型</div>
            </Flex.Item>
            <Flex.Item className="infoPriceItem">
              <div>{size}平米</div>
              <div>面积</div>
            </Flex.Item>
          </Flex>

          <Flex className="infoBasic" align="start">
            <Flex.Item>
              <div>
                <span className="title">装修：</span>
                精装
              </div>
              <div>
                <span className="title">楼层：</span>
                {floor}
              </div>
            </Flex.Item>
            <Flex.Item>
              <div>
                <span className="title">朝向：</span>
                {oriented.join('、')}
              </div>
              <div>
                <span className="title">类型：</span>普通住宅
              </div>
            </Flex.Item>
          </Flex>
        </div>
      </div>
    )
  }
}
