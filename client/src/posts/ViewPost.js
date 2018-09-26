import React from 'react'
import Container from './PostsContainer'
import PropTypes from 'prop-types'
import Link from '../Link'
import {getEditUrl, getRawContent, getTitle} from './reducer.js'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({
      hasError: true,
      errorMessage: error.toString(),
      componentStack: info.componentStack
    })
    // TODO: log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return [
        <h1 key="message">{this.state.errorMessage}</h1>,
        <pre key="stack">{this.state.componentStack}</pre>
      ]
    }
    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node
}

class Presentation extends React.Component {
  render() {
    const {post} = this.props
    return post ? (
      <div>
        <h1>{getTitle(post)}</h1>
        <pre>{getRawContent(post)}</pre>
        <Link to={getEditUrl(post)}>edit</Link>
      </div>
    ) : (
      <div>Loading post&hellip;</div>
    )
  }
}

Presentation.propTypes = {
  post: PropTypes.object
}


export default function PostDetail (props) {
  return <ErrorBoundary>
    <Container {...props}>
      <Presentation/>
    </Container>
  </ErrorBoundary>
}
