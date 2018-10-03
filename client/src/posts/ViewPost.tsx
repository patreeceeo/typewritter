import React from 'react'
import Container from './PostsContainer'
import Link from '../Link'
import {getEditUrl, getRawContent, getTitle, INormalizedPost} from './reducer'

// TODO: use error boundaries?

interface IProps {
  post: INormalizedPost
}

class Presentation extends React.Component<IProps> {
  public render() {
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

export default function PostDetail(props) {
  return (
    <Container {...props}>{({post}) => {
      return <Presentation post={post}/>
    }}</Container>
  )
}
