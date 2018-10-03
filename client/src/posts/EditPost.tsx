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

  public render() {
    const {post} = this.props

    // TODO: don't recreate this function every render
    const handleSubmit = (e) => {
      if(this.refTextarea.current) {
        this.props.updatePost({
          ...post,
          content: this.refTextarea.current.value,
        }).then(goBack)
        e.preventDefault()
      } else {
        // TODO: track error
      }
    }

    const handleCancel = () => {
      goBack()
    }

    return post ? (
      <form onSubmit={handleSubmit}>
        <textarea
          defaultValue={getRawContent(post)}
          ref={this.refTextarea}
        />
        <button>save</button>
        <button type='button' onClick={handleCancel}>cancel</button>
      </form>
    ) : (
      <div>Loading post&hellip;</div>
    )
  }
}

export default function EditPost(props) {
  return (
    <Container {...props}>{({post, updatePost}) => {
      return <Presentation post={post} updatePost={updatePost}/>
    }}</Container>
  )
}


