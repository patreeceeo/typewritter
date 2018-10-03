import React from 'react'
import './App.css'
import router from './router'

interface IProps {
  path: string
}

class App extends React.Component<IProps> {
  public render() {
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
