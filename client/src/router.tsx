import React from 'react'
import ListPosts from './posts/ListPosts'
import ViewPost from './posts/ViewPost'
import EditPost from './posts/EditPost'
import UrlPattern from 'url-pattern'

class UrlParser {
  private byName: {[key: string]: UrlPattern}

  constructor(byName: {[key: string]: string}) {
    this.byName = Object.entries(byName).reduce((memo, [name, pattern]) => {
      return {
        ...memo,
        [name]: new UrlPattern(pattern),
      }
    }, {})
  }

  public parse(path: string): {name: string, matches: {[key: string]: string}} | undefined {
    for (const [name, pattern] of Object.entries(this.byName)) {
      const matches = pattern.match(path)
      if (matches !== null) {
        return {
          name,
          matches,
        }
      }
    }

    return
  }
}

const urlParser = new UrlParser({
  index: "/",
  postIndex: "/posts",
  postDetail: "/posts/:postId",
  postEdit: "/posts/:postId/edit",
})

// Based on https://medium.com/@daveford/react-router-alternative-switch-acd7961f08db

const parserForMatch = {
  postId: (postId) => parseInt(postId, 10)
}

const parsePath = (path) => {
  const parsed = urlParser.parse(path)
  if(parsed) {
    return {
      name: parsed.name,
      matches: Object.entries(parsed.matches).reduce((memo, [key, value]) => {
        return {...memo, [key]: parserForMatch[key](value)}
      }, {})
    }
  }

  return
}

export default function router(props) {
  const parsed = parsePath(props.path)

  if(!parsed) {
    return "Error parsing path"
  }

  switch (parsed.name) {
  case 'postIndex':
    return <ListPosts/>
  case 'postDetail':
    return <ViewPost {...parsed.matches}/>
  case 'postEdit':
    return <EditPost {...parsed.matches}/>
  default:
    return "Not found"
  }
}

export function goBack() {
  window.history.back()
}
