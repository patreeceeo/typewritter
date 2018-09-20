import React from 'react'
import ListPosts from './ListPosts'
import ShowPost from './ShowPost'

// Based on https://medium.com/@daveford/react-router-alternative-switch-acd7961f08db

const parsePath = (path) => {
  const segments = path.split('/')

  if(path === "/") {
    return { name: "index" }
  }

  if(segments.length === 3) {
    return {
      name: segments[1],
      matches: {
        postId: parseInt(segments[2])
      }
    }
  }
}

export default function router (props) {
  const { name, matches } = parsePath(props.path)
  switch(name) {
  case 'index':
    return <ListPosts/>
  case 'posts':
    return <ShowPost id={matches.postId}/>
  }
}

