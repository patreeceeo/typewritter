import React from 'react'
import PropTypes from 'prop-types'
import {normalize} from './post'

export default class PostsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {posts:[]}

    // TODO: use local storage?
    fetch('/api/posts', {
      method: 'GET'
    }).then((response) => {
      response.json().then(({posts}) => {
        this.setState({
          posts: posts.map(normalize)
        })
      })
    })
  }

  render() {
    const {children, ...otherProps} = this.props
    const {posts} = this.state
    return React.cloneElement(children, {posts, ...otherProps})
  }
}

PostsContainer.propTypes = {
  children: PropTypes.node
}
