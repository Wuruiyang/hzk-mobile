import React, { Component } from 'react'
import { API, BASE_URL } from 'utils'
import NavHeader from 'common/NavHeader'
import styles from './index.module.scss'
import { Carousel, Flex } from 'antd-mobile'
import classnames from 'classnames'

const BMap = window.BMap
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

    // 渲染百度地图 需要传入 小区名 和 经纬度
    this.renderMap(res.body.community, res.body.coord)
  }
  // 渲染地图的方法
  renderMap(community, coord) {
    const { latitude, longitude } = coord
    const map = new BMap.Map('map')
    const point = new BMap.Point(longitude, latitude)
    map.centerAndZoom(point, 17)

    const label = new BMap.Label(
      `<span>${community}</span>
      <div class="mapArrow></div>`,
      {
        position: point,
        offset: new BMap.Size(0, -36)
      }
    )
    label.setStyle({
      position: 'absolute',
      zIndex: -7982820,
      backgroundColor: 'rgb(238, 93, 91)',
      color: 'rgb(255, 255, 255)',
      height: 25,
      padding: '5px 10px',
      lineHeight: '14px',
      borderRadius: 3,
      boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
      whiteSpace: 'nowrap',
      fontSize: 12,
      userSelect: 'none'
    })
    map.addOverlay(label)
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
          style={{ background: 'transparent' }}
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

          {/* 渲染百度地图 */}
          <div className="map">
            <div className="mapTitle">
              小区：
              <span>{community}</span>
            </div>
            <div className="mapContainer" id="map">
              地图
            </div>
          </div>
        </div>
        <Flex className="fixedBottom">
          <Flex.Item onClick={this.handleFavorite}>
            <img
              src={BASE_URL + '/img/unstar.png'}
              className="favoriteImg"
              alt="收藏"
            />
            <span className="favorite">收藏</span>
          </Flex.Item>
          <Flex.Item>在线咨询</Flex.Item>
          <Flex.Item>
            <a href="tel:400-618-4000" className="telephone">
              电话预约
            </a>
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
