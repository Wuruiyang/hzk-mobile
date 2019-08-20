import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import City from './pages/City'
import Map from './pages/Map'
import Home from './pages/Home'
import Detail from './pages/Detail'
import Login from './pages/Login'
import AuthRoute from './common/AuthRoute'
import Rent from 'pages/Rent'
import Add from 'pages/Rent/Add'
import Search from 'pages/Rent/Search'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/city" component={City} />
          <Route path="/map" component={Map} />
          <Route path="/detail/:id" component={Detail} />
          <Route path="/login" component={Login} />

          {/* 下面的地址需要登录才能访问 */}
          <AuthRoute path="/rent" exact component={Rent} />
          <AuthRoute path="/rent/add" component={Add} />
          <AuthRoute path="/rent/search" exact component={Search} />

          <Route render={() => <h1>not find, help find some children</h1>} />
        </Switch>
      </Router>
    )
  }
}

export default App
