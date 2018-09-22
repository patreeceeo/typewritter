import React from 'react'
import ListPosts from './ListPosts'
import ShowPost from './ShowPost'

// Based on https://medium.com/@daveford/react-router-alternative-switch-acd7961f08db

const parsePath = (path) => {
  const [_junk, ...segments] = path.split('/')
  void _junk

  if(segments.length === 0) {
    return { name: "index" }
  }

  if(segments.length === 1) {
    switch(segments[0]) {
    case "posts":
      return {
        name: "postIndex"
      }
    default:
      return {
        name: "notFound"
      }
    }
  }

  if(segments.length === 2) {
    switch(segments[0]) {
    case "posts":
      return {
        name: "postDetail",
        matches: {
          postId: parseInt(segments[1], 10)
        }
      }
    default:
      return {
        name: "notFound"
      }
    }
  }
}

export default function router (props) {
  const { name, matches } = parsePath(props.path)
  switch(name) {
  case 'postIndex':
    return <ListPosts/>
  case 'postDetail':
    return <ShowPost {...matches}/>
  default:
    return "Not found"
  }
}

