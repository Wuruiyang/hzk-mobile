import React from 'react'
import './index.scss'

// 因为在index.html上引入script
const BMap = window.BMap

class Map extends React.Component {
  componentDidMount() {
    // 将地图渲染到container中
    const map = new BMap.Map('container')
    const { lat, lng } = JSON.parse(window.localStorage.getItem('location'))
    // console.log(lat, lng)
    const point = new BMap.Point(lng, lat)
    map.centerAndZoom(point, 18)
    // 创建标记
    const marker = new BMap.Marker(point)
    map.addOverlay(marker)
  }
  render() {
    return (
      <div className="map">
        <div id="container" />
      </div>
    )
  }
}

export default Map
