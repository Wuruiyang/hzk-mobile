import React from 'react'
import { Flex } from 'antd-mobile'
import styles from './index.module.scss'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class FilterPicker extends React.Component {
  static propTypes = {
    leftBtn: PropTypes.string,
    rightBtn: PropTypes.string,
    className: PropTypes.string,
    onCancel: PropTypes.func,
    onSave: PropTypes.func
  }
  // 默认的内容
  static defaultProps = {
    leftBtn: '取消',
    rightBtn: '确定',
    onCancel: () => {},
    onSave: () => {}
  }
  render() {
    const { onCancel, onSave, className, leftBtn, rightBtn, style } = this.props
    return (
      <Flex
        style={style}
        className={classnames(styles['filter-footer'], className)}
      >
        {/* 取消按钮 */}
        <span className="btn cancel" onClick={onCancel}>
          {leftBtn}
        </span>
        {/* 确定按钮 */}
        <span className="btn ok" onClick={onSave}>
          {rightBtn}
        </span>
      </Flex>
    )
  }
}
export default FilterPicker
