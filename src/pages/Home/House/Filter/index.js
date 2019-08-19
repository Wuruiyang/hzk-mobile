import React from 'react'
import styles from './index.module.scss'
import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'
import { getCurrentCity, API } from 'utils'
import { Spring } from 'react-spring/renderprops'

class Filter extends React.Component {
  state = {
    titleSelectedStatus: {
      area: false,
      mode: false,
      price: false,
      more: false
    },
    openType: '',
    getFilterData: [],
    selectedValues: {
      area: ['area', 'null'],
      mode: ['null'],
      price: ['null'],
      more: []
    }
  }

  componentDidMount() {
    this.getFilterData()
  }
  // 获取fileterPicker数据
  async getFilterData() {
    const { value } = await getCurrentCity()
    const res = await API.get(`houses/condition?id=${value}`)
    // console.log(res.body)
    this.setState({
      getFilterData: res.body
    })
  }

  // 点击title来控制 高亮, type是点击的每一项title
  changeStatus = type => {
    // 当出现选择框时,需要取消滚动
    document.body.style.overflow = 'hidden'

    const { titleSelectedStatus, selectedValues } = this.state
    let newTitleSelectedStatus = { ...titleSelectedStatus }
    // 获取每一个key,判断key对应的selectedValues的值是否为默认值
    // 如果是默认值,不高亮
    Object.keys(titleSelectedStatus).forEach(key => {
      // const currentTitle = selectedValues[key]
      // 如果key和type相同,说明当前选择的是这个,直接高亮
      if (key === type) {
        newTitleSelectedStatus[key] = true
      } else {
        this.setSelectStatus(key, selectedValues[key], newTitleSelectedStatus)
      }
    })

    this.setState({
      // 解构titleSelectedStatus,将改变的[type],设为true
      titleSelectedStatus: newTitleSelectedStatus,
      openType: type
    })
  }

  // 根据opentype的值, 来渲染fileterPicker
  renderFilterPicker() {
    const { openType, selectedValues } = this.state
    const { area, subway, rentType, price } = this.state.getFilterData
    // 以下的条件不显示fileterPicker
    if (openType === '' || openType === 'more') return
    // 以下条件显示fileterPicker
    let data, cols
    // defauleValue 这是子组件的回显的默认值,是当前的 selectedValues[openType]
    const defaultValue = selectedValues[openType]
    if (openType === 'area') {
      data = [area, subway]
      cols = 3
    } else if (openType === 'mode') {
      data = rentType
      cols = 1
    } else if (openType === 'price') {
      data = price
      cols = 1
    }

    return (
      <FilterPicker
        //小技巧: key 可以让filterPicker重新渲染
        key={openType}
        onCancel={this.onCancel}
        onSave={this.onSave}
        data={data}
        cols={cols}
        defaultValue={defaultValue}
      />
    )
  }
  // 关闭FilterPicker
  // 根据opentype 和 selectedValues{area:[],...} 获取当前的这一项
  onCancel = () => {
    // 当关闭时,又恢复滚动
    document.body.style.overflow = ''

    const { openType, selectedValues, titleSelectedStatus } = this.state
    const newTitleSelectedStatus = { ...titleSelectedStatus }
    // console.log(openType, selectedValues[openType].toString())

    this.setSelectStatus(
      openType,
      selectedValues[openType],
      newTitleSelectedStatus
    )

    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
      openType: ''
    })
  }

  // value是点击确定后,选择的项对应的值["subway", "1号线", "SUY|f83293ce-46c6-d87b"]
  // openType是操作的title.  "area"
  onSave = value => {
    // 当关闭时,又恢复滚动
    document.body.style.overflow = ''

    const { openType, selectedValues, titleSelectedStatus } = this.state
    const { onFileter } = this.props
    let newTitleSelectedStatus = { ...titleSelectedStatus }

    this.setSelectStatus(openType, value, newTitleSelectedStatus)

    // 因为setState是异步的,所以要提前获取修改后的状态
    const newSelectedValues = {
      ...selectedValues,
      [openType]: value
    }
    // console.log(newSelectedValues)
    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: newTitleSelectedStatus
    })

    // onFilter,这个方法传递newSelectedValues给父组件
    onFileter(newSelectedValues)
  }

  // 封装title高亮的方法
  // type:当前选择的title
  // value:当前title下选择的项
  // newTitleSelectedStatus:新的对象
  setSelectStatus(type, value, newTitleSelectedStatus) {
    const key = type
    const temp = value.toString()
    if (key === 'area' && temp !== 'area,null') {
      newTitleSelectedStatus[key] = true
    } else if (key === 'mode' && temp !== 'null') {
      newTitleSelectedStatus[key] = true
    } else if (key === 'price' && temp !== 'null') {
      newTitleSelectedStatus[key] = true
    } else if (key === 'more' && value.length > 0) {
      newTitleSelectedStatus[key] = true
    } else {
      newTitleSelectedStatus[key] = false
    }
  }

  renderFileterMore() {
    const {
      openType,
      getFilterData: { characteristic, floor, oriented, roomType },
      selectedValues
    } = this.state
    const data = { characteristic, floor, oriented, roomType }
    return (
      <FilterMore
        {...data}
        openType={openType}
        defaultValue={selectedValues[openType]}
        onCancel={this.onCancel}
        onSave={this.onSave}
      />
    )
  }

  renderMask() {
    const { openType } = this.state
    const isHide = openType === '' || openType === 'more'
    return (
      <Spring to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }
          return <div style={props} className="mask" onClick={this.onCancel} />
        }}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.filter}>
        {this.renderMask()}

        <div className="content">
          {/* title */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            changeStatus={this.changeStatus}
          />

          {/* picker */}
          {this.renderFilterPicker()}

          {/* more */}
          {this.renderFileterMore()}
        </div>
      </div>
    )
  }
}
export default Filter
