import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'
import { Link } from 'react-router-dom'
import NavHeader from 'common/NavHeader'
import styles from './index.module.scss'
// 从formik导入一些高阶组件,大大的有用
import { withFormik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { API, setToken } from 'utils'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render() {
    return (
      <div className={styles.login}>
        {/* 顶部导航 */}
        <NavHeader className="navHeader">账号登录</NavHeader>
        {/* 上下留白 */}
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <Form>
            <div className="formItem">
              <Field
                className="input"
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* ErrorMessage校验错误的状态   name要对应,component为了添加他的类名  */}
            <ErrorMessage name="username" component="div" className="error" />
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* <div className="error">账号为必填项</div> */}
            <div className="formItem">
              <Field
                className="input"
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage name="password" component="div" className="error" />
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* <div className="error">账号为必填项</div> */}
            <div className="formSubmit">
              <button className="submit" type="submit">
                登 录
              </button>
            </div>
          </Form>
          <Flex className="backHome">
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// formik的使用方法
// withFormik(config配置)(Login)
const config = {
  // 这里 取消 跳转状态

  // 提供两个状态
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 提供提交数据的方法, 这里的方法名handleSubmit(value, formikBag)
  // value是{username: "aaa", password: "aaaa"}
  // formikBag是{props:{...}} 路由的跳转
  handleSubmit: async (value, formikBag) => {
    console.log(value, formikBag)
    const { username, password } = value
    const res = await API.post('user/login', { username, password })
    console.log(res)
    const { status, description, body } = res
    if (status === 200) {
      Toast.info(description, 1)
      setToken(body.token)

      // 判断是否有 form
      // 有 -> replace到form
      // 没有 -> 返回 go(-1)
      const { state } = formikBag.props.location
      if (state) {
        formikBag.props.history.replace(state.from.pathname)
      } else {
        formikBag.props.history.go(-1)
      }
    } else {
      Toast.info(description, 1)
    }
  },
  // 创建yup的校验规则
  // shape: 校验规则的样式
  validationSchema: Yup.object().shape({
    username: Yup.string()
      .required('请输入用户名')
      .matches(/^[a-zA-Z_\d]{5,8}$/, '用户名长度5-8,字母数字下划线'),
    password: Yup.string()
      .required('请输入密码')
      .matches(/^[a-zA-Z_\d]{5,12}$/, '密码5-12位')
  })
}

export default withFormik(config)(Login)

// formik的结构
/**
<Form>
  <div className="formItem">
    <Field></Field>
  </div>
  <ErrorMessage name=.. conpnent=div ...>

  <div className="formItem">
    <Field name=xxx ....></Field>
  </div>
  <ErrorMessage name=.. conpnent=div ...>

  <div className="formSubmit">
    <button className="submit" type="submit">
      登 录
    </button>
  </div>
</Form>  
 */
