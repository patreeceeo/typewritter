import React, { Component } from 'react'
import './App.css'
import PropTypes from 'prop-types'
import router from './router'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="App">
        {router(this.props)}
      </div>
    )
  }
}


// class TextEditor extends Component {
//   handleChange(e) {
//     this.props.onChange(e)
//   }

//   render() {
//     return (
//       <div className="App">
//         <textarea onChange={(e) => this.handleChange(e)} value={this.props.value}></textarea>
//       </div>
//     )
//   }
// }

// TextEditor.propTypes = {
//   onChange: PropTypes.func,
//   value: PropTypes.string
// }

export default App
