import React from 'react'
import ReactDOM from 'react-dom'

class My extends React.Component {
  render() {
    return <div>这是My 组件</div>
  }
}
ReactDOM.render(<My />, document.getElementById('root'))
