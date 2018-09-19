import React, { Component } from 'react'
import './App.css'
import PropTypes from 'prop-types'
import matter from 'gray-matter'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="App">
        <ListPosts/>
      </div>
    )
  }
}

function getExerpt(content) {
  // Note: gray-matter has support for excerpts
  return content.length >= 120 ? content.substr(0, 119) + '…' : content
}

class ListPosts extends Component {
  constructor(props) {
    super(props)

    this.state = {posts:[]}

    fetch('/api/posts', {
      method: 'GET'
    }).then((response) => {
      response.json().then(({posts}) => {
        this.setState({
          posts
        })
      })
    })
  }

  render() {
    return <ul>{
      this.state.posts.map((post) => {
        const parsedPost = matter(post.post_with_metadata)

        return (
          <li key={post.id}>
            <a href={`/post/${post.id}`}>{parsedPost.data.title}</a>
            <p>
              {getExerpt(parsedPost.content)}
            </p>
          </li>
        )
      })
    }</ul>
  }
}

class TextEditor extends Component {
  handleChange(e) {
    this.props.onChange(e)
  }

  render() {
    return (
      <div className="App">
        <textarea onChange={(e) => this.handleChange(e)} value={this.props.value}></textarea>
      </div>
    )
  }
}

TextEditor.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string
}

export default App
