import React from 'react'
import ReactDOM from 'react-dom'

class House extends React.Component {
  render() {
    return <div>这是House组件</div>
  }
}
ReactDOM.render(<House />, document.getElementById('root'))
