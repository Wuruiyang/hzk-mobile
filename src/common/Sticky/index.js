import React, { Component, createRef } from 'react'
import styles from './index.module.scss'
import PropTypes from 'prop-types'

export default class index extends Component {
  static propsTypes = {
    size: PropTypes.number,
    // 传过来的children必须是jsx
    children: PropTypes.element.isRequired
  }
  static defaultProps = {
    size: 40
  }
  constructor(props) {
    super(props)
    this.contentRef = createRef()
    this.placeHolderRef = createRef()
  }

  // 添加滚动的监听事件,来监听滚动到哪个位置了
  componentDidMount() {
    window.addEventListener('scroll', this.handelScroll)
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.handelScroll)
  }

  handelScroll = () => {
    // 对占位的div监听,获取他到顶部的距离,当为0时,说明接近顶部
    const { top } = this.placeHolderRef.current.getBoundingClientRect()
    if (top <= 0) {
      // 在ref上添加class用,classList;操作行内样式用style
      // 给真实的元素,脱标
      this.contentRef.current.classList.add(styles.fixed)
      // 给占位的元素,增加一个高度,防止跳动
      this.placeHolderRef.current.style.height = this.props.size + 'px'
    } else {
      this.contentRef.current.classList.remove(styles.fixed)
      this.placeHolderRef.current.style.height = '0px'
    }
  }

  render() {
    return (
      <div className="sticky">
        <div className="placeHolder" ref={this.placeHolderRef} />
        <div className="content" ref={this.contentRef}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
