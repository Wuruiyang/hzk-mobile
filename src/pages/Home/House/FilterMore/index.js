import React from 'react'
import styles from './index.module.scss'
import classnames from 'classnames'
import FilterFooter from '../FilterFooter'
class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  renderItem(data) {
    const { selectedValues } = this.state
    return data.map(item => (
      <span
        className={classnames('tag', {
          'tag-active': selectedValues.includes(item.value)
        })}
        key={item.value}
        onClick={this.handleClick.bind(this, item.value)}
      >
        {item.label}
      </span>
    ))
  }

  handleClick(value) {
    var newSelectedValues = this.state.selectedValues.slice()
    // 如果点击过,就删除;如果没有就添加
    if (newSelectedValues.includes(value)) {
      newSelectedValues = newSelectedValues.filter(item => item !== value)
    } else {
      newSelectedValues.push(value)
    }
    // console.log(newSelectedValues)
    this.setState({
      selectedValues: newSelectedValues
    })
  }

  render() {
    const {
      characteristic,
      floor,
      oriented,
      roomType,
      onSave,
      onCancel
    } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles['filter-more']}>
        {/* 遮罩层 */}
        <div className="mask" onClick={onCancel} />
        {/* 条件内容 */}
        <div className="tags">
          <dl className="dl">
            <dt className="dt">户型</dt>
            <dd className="dd">{this.renderItem(roomType)}</dd>

            <dt className="dt">朝向</dt>
            <dd className="dd">{this.renderItem(oriented)}</dd>

            <dt className="dt">楼层</dt>
            <dd className="dd">{this.renderItem(floor)}</dd>

            <dt className="dt">房屋亮点</dt>
            <dd className="dd">{this.renderItem(characteristic)}</dd>
          </dl>
        </div>
        <FilterFooter
          className="footer"
          leftBtn="清除"
          onCancel={() => this.setState({ selectedValues: [] })}
          onSave={() => onSave(selectedValues)}
        />
      </div>
    )
  }
}
export default FilterMore
