import React from 'react'
import Link from '../Link'
import Container from './DataContainer'
import PropTypes from 'prop-types'
import {getKey, getDetailUrl, getExerpt, getTitle} from './reducer'

// TODO: use ReactReason?!

class Presentation extends React.Component {
  render() {
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

Presentation.propTypes = {
  posts: PropTypes.array
}

export default function ListPosts (props) {
  return <Container {...props} ><Presentation/></Container>
}

