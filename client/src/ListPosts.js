import React from 'react'
import matter from 'gray-matter'
import Link from './Link'

function getExerpt(content) {
  // Note: gray-matter has support for excerpts
  return content.length >= 120 ? content.substr(0, 119) + '…' : content
}


export default class ListPosts extends React.Component {
  constructor(props) {
    super(props)

    this.state = {posts:[]}

    fetch('/api/posts', {
      method: 'GET'
    }).then((response) => {
      response.json().then(({posts}) => {
        this.setState({
          posts
        })
      })
    })
  }

  render() {
    return <ul>{
      this.state.posts.map((post) => {
        const parsedPost = matter(post.post_with_metadata)

        return (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{parsedPost.data.title}</Link>
            <p>
              {getExerpt(parsedPost.content)}
            </p>
          </li>
        )
      })
    }</ul>
  }
}
