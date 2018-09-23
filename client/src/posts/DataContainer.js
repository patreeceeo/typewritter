import React from 'react'
import PropTypes from 'prop-types'
import {normalize, denormalize, getPostById, updateRawContent} from './reducer.js'

export default class PostsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {posts:[]}

    // TODO: use reducer

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

  getPropsForSpecified() {
    const {posts} = this.state
    const post = getPostById(posts, parseInt(this.props.postId), 10)
    return {
      post,
      updateRawContent: (content) => {
        updateRawContent(post, content)
        fetch(`/api/posts/${post.id}`, {
          method: 'PUT',
          body: JSON.stringify(denormalize(post))
        })
      }
    }
  }

  getPropsForCollection() {
    const {children, ...otherProps} = this.props
    void children
    const {posts} = this.state
    return {
      posts,
      ...otherProps
    }
  }

  render() {
    const {children} = this.props
    const childProps = typeof(this.props.postId) !== 'undefined' ? this.getPropsForSpecified() : this.getPropsForCollection()
    return React.cloneElement(children, childProps)
  }
}

PostsContainer.propTypes = {
  children: PropTypes.node,
  postId: PropTypes.string
}
