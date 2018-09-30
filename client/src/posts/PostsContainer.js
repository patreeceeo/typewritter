import React from 'react'
import PropTypes from 'prop-types'
import {getPostById, fetchPosts, updatePost} from './reducer.js'
import {connect} from 'react-redux'

function Loading() {
  return <div>Loading&hellip;</div>
}

class PostsContainer extends React.Component {
  constructor(props) {
    super(props)

    this.props.fetchPosts()
  }

  render() {
    const {children, entities: posts, ...otherProps} = this.props
    const post = this.props.updating && this.props.updating.id === this.props.postId ?
      this.props.updating
      : getPostById(posts, parseInt(this.props.postId, 10))

    const childProps = typeof(this.props.postId) !== 'undefined' ? {
      post,
      ...otherProps,
    } : {
      posts,
      ...otherProps,
    }

    return this.props.fetching ? <Loading/> : React.cloneElement(children, childProps)
  }
}

PostsContainer.propTypes = {
  children: PropTypes.node,
  postId: PropTypes.string,
  entities: PropTypes.array,
  fetchPosts: PropTypes.func,
  updatePost: PropTypes.func,
  fetching: PropTypes.bool,
  updating: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}


export default connect(
  (state) => state.posts,
  (dispatch) => ({
    fetchPosts: () => dispatch(fetchPosts()),
    updatePost: (post) => dispatch(updatePost(post)),
  }),
)(PostsContainer)


