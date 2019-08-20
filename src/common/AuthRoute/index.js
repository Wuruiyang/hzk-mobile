// AuthRoute是用户鉴定权限的路由,用法和route一样
// 如果登录了正常route,如果没有就跳转到登录页面
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { hasToken } from 'utils'

// ...rest是剩余的所有的属性
export default function AuthRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        hasToken() ? (
          <Component {...props} />
        ) : (
          // 给重定向需要login的时候,增加一个form的属性,里面记录了跳转的信息
          // location的内容在prop里面
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  )
}
