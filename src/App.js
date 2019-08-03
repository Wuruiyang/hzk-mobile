import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import City from './pages/City'
import Map from './pages/Map'
import Home from './pages/Home'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/city" component={City} />
        <Route path="/map" component={Map} />
      </Router>
    )
  }
}

export default App
