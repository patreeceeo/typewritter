import React from 'react'
import ListPosts from './posts/ListPosts'
import ViewPost from './posts/ViewPost'
import EditPost from './posts/EditPost'
import AddPost from './posts/AddPost'
import UrlPattern from 'url-pattern'
import Dashboard from './Dashboard'
import BuildConsole from './fitz/BuildConsole'

class UrlParser {
  private byName: {[key: string]: UrlPattern}

  constructor(byName: {[key: string]: string}) {
    const options = {
      segmentNameCharset: 'a-zA-Z0-9_-'
    }

    this.byName = Object.entries(byName).reduce((memo, [name, pattern]) => {
      return {
        ...memo,
        [name]: new UrlPattern(pattern, options),
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

  public stringify(name: string, valuesByKey: {[key: string]: any} = {}): string {
    return this.byName[name].stringify(valuesByKey)
  }
}

const urlParser = new UrlParser({
  index: "/",
  postIndex: "/posts",
  postDetail: "/post/:post_id",
  postEdit: "/editPost/:post_id",
  postAdd: "/addPost",
  buildIndex: "/build",
})

// Based on https://medium.com/@daveford/react-router-alternative-switch-acd7961f08db

const parserForMatch = {
  post_id: (id) => parseInt(id, 10)
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
    case 'index': {
      return <Dashboard/>
    }
    case 'postIndex': {
      return <ListPosts/>
    }
    case 'postDetail': {
      return <ViewPost {...parsed.matches}/>
    }
    case 'postEdit': {
      return <EditPost {...parsed.matches}/>
    }
    case 'postAdd': {
      return <AddPost {...parsed.matches}/>
    }
    case 'buildIndex': {
      return <BuildConsole/>
    }
    default: {
      return "Not found"
    }
  }
}

export function goBack() {
  window.history.back()
}

export function goTo(state) {
  window.history.pushState('', '', state)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function getUrl(routeName: string, routeParams?: {[key: string]: any}): string {
  return urlParser.stringify(routeName, routeParams)
}
