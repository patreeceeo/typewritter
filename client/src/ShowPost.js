import React from 'react'
import Container from './PostsContainer'
import PropTypes from 'prop-types'

class Presentation extends React.Component {
  render() {
    const post = this.props.posts.filter((post) => post.id === this.props.postId)[0]
    return post ? <div>{post.content}</div> : <div>Error</div>
  }
}

Presentation.propTypes = {
  postId: PropTypes.number,
  posts: PropTypes.array
}


export default function PostDetail (props) {
  return <Container {...props}><Presentation/></Container>
}
