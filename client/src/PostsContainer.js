import React from 'react'
import PropTypes from 'prop-types'
import matter from 'gray-matter'

function normalizePost({post_with_metadata, ...post}) {
  const parsed = matter(post_with_metadata)
  return {
    ...post,
    ...parsed.data,
    content: parsed.content
  }
}

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
          posts: posts.map(normalizePost)
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
