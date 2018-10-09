import React from 'react'
import {goTo} from './router'

export default class Link extends React.Component<{to: string, tagName?: string}> {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  public render() {
    const {to, tagName, children} = this.props

    switch(tagName) {
      case "a":
      default:
        return <a href={to} onClick={this.handleClick}>{children}</a>
      case "button":
        return <button onClick={this.handleClick}>{children}</button>
    }
  }

  private handleClick(event) {
    event.preventDefault()
    goTo(this.props.to)
  }
}

