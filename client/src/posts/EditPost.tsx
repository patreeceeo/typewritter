import React from 'react'
import Container from './PostsContainer'
import {getRawContent, INormalizedPost} from './reducer'
import {goBack} from '../router'

// TODO: use async/await?

interface IProps {
  post: INormalizedPost,
  updatePost: (INormalizedPost) => Promise<void>
}

class Presentation extends React.Component<IProps> {
  private refTextarea = React.createRef<HTMLTextAreaElement>()

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  public render() {
    const {post} = this.props

    return post ? (
      <form onSubmit={this.handleSubmit}>
        <textarea
          defaultValue={getRawContent(post)}
          ref={this.refTextarea}
        />
        <button>save</button>
        <button type='button' onClick={this.handleCancel}>cancel</button>
      </form>
    ) : (
      <div>Loading post&hellip;</div>
    )
  }

  private handleSubmit(e) {
    if(this.refTextarea.current) {
      this.props.updatePost({
        ...this.props.post,
        content: this.refTextarea.current.value,
      }).then(goBack)
      e.preventDefault()
    } else {
      // TODO: track error
    }
  }

  private handleCancel() {
    goBack()
  }
}

export default function EditPost(props) {
  return (
    <Container {...props}>{({post, updatePost}) => {
      return <Presentation post={post} updatePost={updatePost}/>
    }}</Container>
  )
}


