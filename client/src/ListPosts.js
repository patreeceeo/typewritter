import React from 'react'
import Link from './Link'
import Container from './PostsContainer'
import PropTypes from 'prop-types'

// TODO: use ReactReason?!

function getExerpt(content) {
  // Note: gray-matter has support for excerpts
  return content.length >= 120 ? content.substr(0, 119) + '…' : content
}


class Presentation extends React.Component {
  render() {
    return <ul>{
      this.props.posts.map((post) => {

        return (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link>
            <p>
              {getExerpt(post.content)}
            </p>
          </li>
        )
      })
    }</ul>
  }
}

Presentation.propTypes = {
  posts: PropTypes.array
}

export default function ListPosts (props) {
  return <Container {...props} ><Presentation/></Container>
}

