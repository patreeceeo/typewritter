import React from 'react'
import {goTo} from './router'

export default class Link extends React.Component<{to: string, type?: string}> {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  public render() {
    const {to, type, children} = this.props

    const mapTypeToRenderer = {
      text: () => <a href={to} onClick={this.handleClick}>{children}</a>,
      button: () => <button onClick={this.handleClick}>{children}</button>,
    }

    return mapTypeToRenderer[typeof type === 'undefined' ? 'text' : type]()

  }

  private handleClick(event) {
    event.preventDefault()
    goTo(this.props.to)
  }
}

