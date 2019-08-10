import React from 'react'
import { getCurrentCity } from 'utils/index'
import NavHeader from 'common/NavHeader'
import Axios from 'axios'
import styles from './index.module.scss'

// 因为在index.html上引入script
const BMap = window.BMap

class Map extends React.Component {
  state = {
    isShow: false,
    houses: []
  }
  componentDidMount() {
    this.initMap()
  }
  async initMap() {
    const { label, value } = await getCurrentCity()
    // 将地图渲染到container中
    const map = new BMap.Map('container')
    this.map = map
    // 通过地理位置,渲染页面
    const myGeo = new BMap.Geocoder()
    // 参数1:详细地点, 参数2:point的回调函数, 参数3:大致的地点
    myGeo.getPoint(
      label,
      async point => {
        if (!point) return
        // centerAndZoom(), 让地图居中,设置缩放大小
        map.centerAndZoom(point, 11)
        // 添加控件
        map.addControl(new BMap.NavigationControl())
        map.addControl(new BMap.ScaleControl())
        // 渲染覆盖物
        this.renderOverlays(value)
      },
      label
    )
    this.map.addEventListener('movestart', () => {
      this.setState({
        isShow: false
      })
    })
  }

  async renderOverlays(value) {
    const { type, nextZoom } = this.getTypeAndZoom()
    // 发送ajax获取房源地点
    const res = await Axios.get(`http://localhost:8080/area/map?id=${value}`)
    // console.log(res.data.body)
    res.data.body.forEach(item => {
      // 确认覆盖物的类型
      this.addOverlay(item, type, nextZoom)
    })
  }
  getTypeAndZoom() {
    let type, nextZoom
    // getZoom()获取当前的层级
    const zoom = this.map.getZoom()
    if (zoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }
    return {
      type,
      nextZoom
    }
  }
  // item是每一个地区, 确认要渲染的类型
  addOverlay(item, type, nextZoom) {
    if (type === 'circle') {
      this.createCircle(item, nextZoom)
    } else {
      this.createRect(item, nextZoom)
    }
  }
  createCircle(item, nextZoom) {
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    console.log(point)

    const opts = {
      // 文本标注点
      position: point,
      // x,y的偏移
      offset: new BMap.Size(-35, -35)
    }
    const html = `
      <div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>
      `
    // 创建label
    var label = new BMap.Label(html, opts)
    // 清除默认样式
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })
    // 将label添加到地图上
    this.map.addOverlay(label)

    // 添加click事件,用百度地图api的方法添加
    label.addEventListener('click', () => {
      // bug:直接清除覆盖物,百度内置的逻辑行不通
      // 解决: 设置延迟器
      setTimeout(() => {
        //1. 清除所有的覆盖物
        this.map.clearOverlays()
      }, 0)
      // 设置中心点,缩放的级别
      this.map.centerAndZoom(point, nextZoom)
      // 根据value渲染下一级覆盖物
      this.renderOverlays(item.value)
    })
  }
  createRect(item, nextZoom) {
    const html = `
      <div class="rect">
        <span class="housename">${item.label}</span>
        <span class="housenum">${item.count}套</span>
        <i class="arrow"></i>
      </div>
    `
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const opts = {
      position: point,
      offset: new BMap.Size(-50, -20)
    }
    const label = new BMap.Label(html, opts)
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })
    this.map.addOverlay(label)
    label.addEventListener('click', () => {
      console.log(item.value)
      this.getHouses(item.value)
    })
  }
  // 点击方形房子,获取房子信息
  async getHouses(id) {
    const res = await Axios.get(`http://localhost:8080/houses?cityId=${id}`)
    this.setState({
      isShow: true,
      houses: res.data.body.list
    })
    console.log(res.data.body.list)
  }
  renderHouses() {
    // 通过state的houses:[] 来渲染
    return this.state.houses.map(item => (
      <div className="house" key={item.houseCode}>
        <div className="imgWrap">
          <img
            className="img"
            src={`http://localhost:8080${item.houseImg}`}
            alt=""
          />
        </div>
        <div className="content">
          <h3 className="title">{item.title}</h3>
          <div className="desc">{item.desc}</div>
          <div>
            {item.tags.map((item, index) => {
              const num = (index % 3) + 1
              const name = `tag tag${num}`
              return (
                <span className={name} key={index}>
                  {item}
                </span>
              )
            })}
          </div>
          <div className="price">
            <span className="priceNum">{item.price}</span> 元/月
          </div>
        </div>
      </div>
    ))
  }

  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container" />
        <div className={`houseList ${this.state.isShow ? 'show' : ''}`}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">{this.renderHouses()}</div>
        </div>
      </div>
    )
  }
}

export default Map
