import React from 'react'
import ListPosts from './posts/ListPosts'
import ViewPost from './posts/ViewPost'
import EditPost from './posts/EditPost'
import UrlPattern from 'url-pattern'

class UrlParser {
  constructor(byName) {
    this.byName = Object.entries(byName).reduce((memo, [name, pattern]) => {
      return {
        ...memo,
        [name]: new UrlPattern(pattern)
      }
    }, {})
  }

  parse(path) {
    for(let [name, pattern] of Object.entries(this.byName)) {
      const matches = pattern.match(path)
      if(matches !== null) {
        return {
          name,
          matches
        }
      }
    }
  }
}

const urlParser = new UrlParser({
  index: "/",
  postIndex: "/posts",
  postDetail: "/posts/:postId",
  postEdit: "/posts/:postId/edit"
})

// Based on https://medium.com/@daveford/react-router-alternative-switch-acd7961f08db

// TODO: use route string parsing library?
const parsePath = (path) => {
  return urlParser.parse(path)
}

export default function router (props) {
  const { name, matches } = parsePath(props.path)
  switch(name) {
  case 'postIndex':
    return <ListPosts/>
  case 'postDetail':
    return <ViewPost {...matches}/>
  case 'postEdit':
    return <EditPost {...matches}/>
  default:
    return "Not found"
  }
}

export function goBack() {
  window.history.back()
}
