import React from 'react'
import Container from './DataContainer'
import PropTypes from 'prop-types'
import Link from '../Link'
import {getEditUrl, getRawContent, getTitle} from './reducer.js'

class Presentation extends React.Component {
  renderPost(post) {
    return <div>
      <h1>{getTitle(post)}</h1>
      <pre>{getRawContent(post)}</pre>
      <Link to={getEditUrl(post)}>edit</Link>
    </div>
  }

  render() {
    const post = this.props.posts.filter((post) => post.id === this.props.postId)[0]
    return post ? this.renderPost(post) : <div>Error</div>
  }
}

Presentation.propTypes = {
  postId: PropTypes.number,
  posts: PropTypes.array
}


export default function PostDetail (props) {
  return <Container {...props}><Presentation/></Container>
}
