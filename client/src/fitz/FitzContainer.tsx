import React from 'react'
import {startBuild} from './reducer'
import {connect} from 'react-redux'

function Loading() {
  return <div>Loading&hellip;</div>
}

interface IProps  {
  building: boolean,
  children: (props: {[key: string]:any}) => React.ReactElement<any>
}

class FitzContainer extends React.Component<IProps>{
  public render() {
    const {children, ...childProps} = this.props

    return this.props.building ? <Loading/> : children ? children(childProps) : "No presentation component provided"
  }
}


export default connect(
  (state) => state.fitz,
  (dispatch) => ({
    startBuild: () => dispatch(startBuild()),
  }),
)(FitzContainer)


