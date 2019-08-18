import React from 'react'
import styles from './index.module.scss'
import classnames from 'classnames'
import FilterFooter from '../FilterFooter'
import { Spring } from 'react-spring/renderprops'

class FilterMore extends React.Component {
  state = {
    selectedValues: this.props.defaultValue
  }
  // 默认的props
  static defaultProps = {
    defaultValue: []
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
      characteristic = [],
      floor = [],
      oriented = [],
      roomType = [],
      onSave,
      onCancel,
      openType
    } = this.props
    const { selectedValues } = this.state
    return (
      <div className={styles['filter-more']}>
        {/* 遮罩层 */}
        <Spring to={{ opacity: openType === 'more' ? 1 : 0 }}>
          {props => {
            if (props.opacity === 0) {
              return null
            }
            return <div style={props} className="mask" onClick={onCancel} />
          }}
        </Spring>

        {/* 条件内容 */}
        <Spring
          to={{
            transform:
              openType === 'more' ? 'translateX(0%)' : 'translateX(100%)'
          }}
        >
          {props => {
            return (
              <>
                <div className="tags" style={props}>
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
                  style={props}
                  className="footer"
                  leftBtn="清除"
                  onCancel={() => this.setState({ selectedValues: [] })}
                  onSave={() => onSave(selectedValues)}
                />
              </>
            )
          }}
        </Spring>
      </div>
    )
  }
}
export default FilterMore
