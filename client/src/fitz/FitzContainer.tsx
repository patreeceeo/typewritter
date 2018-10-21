import React from 'react'
import {startBuild} from './reducer'
import {connect} from 'react-redux'

interface IProps  {
  building: boolean,
  children: (props: {[key: string]:any}) => React.ReactElement<any>
}

class FitzContainer extends React.Component<IProps>{
  public render() {
    const {children, ...childProps} = this.props

    return children(childProps)
  }
}


export default connect(
  (state) => {
    console.log(state.fitz)
    return state.fitz
  },
  (dispatch) => ({
    startBuild: () => dispatch(startBuild()),
  }),
)(FitzContainer)


