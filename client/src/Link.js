import React from 'react'
import PropTypes from 'prop-types'

export default function Link(props) {

  // TODO: don't recreate this function every render
  const onClick = (event) => {
    event.preventDefault()
    window.history.pushState(null, null, props.to)
    window.dispatchEvent(new window.PopStateEvent('popstate'))
  }

  return <a href={props.to} onClick={onClick}>{props.children}</a>
}

Link.propTypes = {
  children: PropTypes.node,
  to: PropTypes.string,
}
