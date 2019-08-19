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
          <Route render={() => <h1>not find, help find some children</h1>} />
        </Switch>
      </Router>
    )
  }
}

export default App
