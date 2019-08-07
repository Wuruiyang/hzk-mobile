import React from 'react'
import './index.scss'
import NavHeader from 'common/NavHeader'

// 因为在index.html上引入script
const BMap = window.BMap

class Map extends React.Component {
  componentDidMount() {
    // 将地图渲染到container中
    const map = new BMap.Map('container')
    // const { lat, lng } = JSON.parse(window.localStorage.getItem('location'))
    // const point = new BMap.Point(lng, lat)
    const point = new BMap.Point(121.61887341233741, 31.040603951746952)
    map.centerAndZoom(point, 18)
    // 创建标记
    const marker = new BMap.Marker(point)
    map.addOverlay(marker)
  }
  render() {
    return (
      <div className="map">
        <NavHeader>地图找房</NavHeader>
        <div id="container" />
      </div>
    )
  }
}

export default Map
