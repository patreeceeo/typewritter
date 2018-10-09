import React from 'react'
import Link from '../Link'
import Container from './PostsContainer'
import {getKey, getDetailUrl, getEditUrl, getExerpt, getTitle, INormalizedPost} from './reducer'
import {goTo} from '../router'

// TODO: use ReactReason?!

class ListItem extends React.Component<{post: INormalizedPost, removePost: (post: INormalizedPost) => {}}> {
  constructor(props) {
    super(props)

    this.handleClickRemove = this.handleClickRemove.bind(this)
  }

  public render() {
    const {post} = this.props
    return (
      <li>
        <Link to={getDetailUrl(post)}>{getTitle(post)}</Link>
        <p>
          {getExerpt(post)}
      </p>
      <Link
        tagName="button"
        to={getEditUrl(post)}
      >
        edit
      </Link>
      <button
        onClick={this.handleClickRemove}
      >
        remove
      </button>
    </li>
    )
  }

  private handleClickRemove() {
    this.props.removePost(this.props.post)
  }
}

class Presentation extends React.Component<{posts: INormalizedPost[], addPost: () => Promise<INormalizedPost>, removePost: (post: INormalizedPost)=>{}}> {
  constructor(props) {
    super(props)

    this.handleClickAdd = this.handleClickAdd.bind(this)
  }

  public render() {
    return <React.Fragment>
      <ul>{
        this.props.posts.map((post) => <ListItem key={getKey(post)} post={post} removePost={this.props.removePost}/>)
      }</ul>
      <button onClick={this.handleClickAdd}>add</button>
    </React.Fragment>
  }

  private handleClickAdd() {
    this.props.addPost().then((action) => {

      // TODO: why do I have to do this?
      // e.g. why does TSC think action is an INormalizedPost?
      interface IAction {
        payload: {
          post: INormalizedPost
        }
      }

      goTo(getEditUrl((action as unknown as IAction).payload.post))
    })
  }
}


export default function ListPosts(props) {
  return <Container {...props} >{({posts, addPost, removePost}) => {
    return (
      <Presentation
        posts={posts}
        addPost={addPost}
        removePost={removePost}
      />
    )
  }}</Container>
}

