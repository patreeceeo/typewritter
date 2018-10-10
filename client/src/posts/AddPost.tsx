import React from 'react'
import Container from './PostsContainer'
import {getRawContent, INormalizedPost, fabricatePost, normalize} from './reducer'
import {goBack} from '../router'

interface IProps {
  addPost: (INormalizedPost) => Promise<void>
}

class Presentation extends React.Component<IProps> {
  private refTextarea = React.createRef<HTMLTextAreaElement>()
  private post: INormalizedPost = normalize(fabricatePost())

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  public render() {

    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          defaultValue={getRawContent(this.post)}
          ref={this.refTextarea}
        />
        <button>save</button>
        <button type='button' onClick={this.handleCancel}>cancel</button>
      </form>
    )
  }

  private handleSubmit(e) {
    if(this.refTextarea.current) {
      this.props.addPost({
        ...this.post,
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

export default function AddPost(props) {
  return (
    <Container {...props}>{({addPost}) => {
      return (
        <Presentation
          addPost={addPost}
        />
      )
    }}</Container>
  )
}


