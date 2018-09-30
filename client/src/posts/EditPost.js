import React from 'react'
import Container from './PostsContainer'
import {getRawContent} from './reducer'
import PropTypes from 'prop-types'
import {goBack} from '../router'

// TODO: use TSLint?


class Presentation extends React.Component {
  render() {
    const {post} = this.props

    // TODO: don't recreate this function every render
    const handleSubmit = (e) => {
      this.props.updatePost({
        ...post,
        content: this.refTextarea.value,
      }).then(goBack)
      e.preventDefault()
    }

    const handleCancel = () => {
      goBack()
    }

    return post ? (
      <form onSubmit={handleSubmit}>
        <textarea
          defaultValue={getRawContent(post)}
          ref={(el) => this.refTextarea = el}
        />
        <button>save</button>
        <button type='button' onClick={handleCancel}>cancel</button>
      </form>
    ) : (
      <div>Loading post&hellip;</div>
    )
  }
}

Presentation.propTypes = {
  post: PropTypes.object,
  updatePost: PropTypes.func,
}

export default function EditPost(props) {
  return <Container {...props}><Presentation/></Container>
}


