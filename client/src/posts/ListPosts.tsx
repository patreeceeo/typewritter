import React from 'react'
import Link from '../Link'
import Container from './PostsContainer'
import {getKey, getDetailUrl, getExerpt, getTitle, INormalizedPost} from './reducer'

// TODO: use ReactReason?!

class Presentation extends React.Component<{posts: INormalizedPost[]}> {
  public render() {
    return <ul>{
      this.props.posts.map((post) => {

        return (
          <li key={getKey(post)}>
            <Link to={getDetailUrl(post)}>{getTitle(post)}</Link>
            <p>
              {getExerpt(post)}
            </p>
          </li>
        )
      })
    }</ul>
  }
}


export default function ListPosts(props) {
  return <Container {...props} >{({posts}) => {
    return <Presentation posts={posts}/>
  }}</Container>
}

