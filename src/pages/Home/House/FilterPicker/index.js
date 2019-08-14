// bug 在选择区域时,切换到方式,会无法渲染默认的value
// 原因: picker没有关闭的时候,切换时defaultValue改变了,但是this.state没有改变
// 解决办法: 在组件更新时,componentDidUpdate(prev),要重新setState({...})
import React from 'react'
import { PickerView } from 'antd-mobile'
import styles from './index.module.scss'
import FilterFooter from '../FilterFooter'

class FilterPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.defaultValue
    }
  }

  // 重新更新 setState({...})
  componentDidUpdate(prev) {
    if (prev.defaultValue !== this.props.defaultValue) {
      this.setState({
        value: this.props.defaultValue
      })
    }
  }

  getValue = value => {
    this.setState({
      value
    })
  }
  render() {
    const { onCancel, onSave, data, cols } = this.props
    const { value } = this.state
    return (
      <div className={styles['filter-picker']}>
        {/* 三级联动 */}
        <PickerView
          data={data}
          value={value}
          cols={cols}
          onChange={this.getValue}
        />

        {/* 底部 */}
        <FilterFooter onCancel={onCancel} onSave={() => onSave(value)} />
      </div>
    )
  }
}
export default FilterPicker
