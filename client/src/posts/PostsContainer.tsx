import React from 'react'
import {getPostById, fetchPosts, updatePost, addPost, removePost, INormalizedPost} from './reducer'
import {connect} from 'react-redux'

function Loading() {
  return <div>Loading&hellip;</div>
}

interface IProps {
  entities: INormalizedPost[],
  fetchPosts: () => {},
  updating?: INormalizedPost,
  id: INormalizedPost["id"],
  fetching: boolean,
  children: (props: {[key: string]:any}) => React.ReactElement<any>
}

class PostsContainer extends React.Component<IProps>{
  constructor(props) {
    super(props)

    this.props.fetchPosts()
  }

  public render() {
    const {children, entities: posts, ...otherProps} = this.props
    const post = this.props.updating && this.props.updating.id === this.props.id ?
      this.props.updating
      : getPostById(posts, this.props.id)

    const childProps = typeof(this.props.id) !== 'undefined' ? {
      post,
      ...otherProps,
    } : {
      posts,
      ...otherProps,
    }

    return this.props.fetching ? <Loading/> : children ? children(childProps) : "No presentation component provided"
  }
}


export default connect(
  (state) => state.posts,
  (dispatch) => ({
    fetchPosts: () => dispatch(fetchPosts()),
    updatePost: (post) => dispatch(updatePost(post)),
    addPost: (post) => dispatch(addPost(post)),
    removePost: (post) => dispatch(removePost(post)),
  }),
)(PostsContainer)


