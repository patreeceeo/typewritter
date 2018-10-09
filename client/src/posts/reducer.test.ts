import * as _r from './reducer'
import {isFSA} from 'flux-standard-action'
import configureMockStore from 'redux-mock-store'
import FsaThunk from 'fsa-redux-thunk'
// this import just makes typescript happy...
// `global.fetch` is set up in ./setupTests
import fetch from 'jest-fetch-mock'

const mockStore = configureMockStore([FsaThunk])

beforeEach(() => {
  fetch.resetMocks()
})

describe('fetchPosts', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.fetchPosts)).toEqual('function')
    const action = _r.fetchPosts()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('updates the application state', () => {
    const state = {
      fetching: false,
    }

    const action = _r.fetchPosts()

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      fetching: true,
    })
  })

  it('interacts with the API correctly (happy case)', () => {
    const posts = [
      _r.fabricatePost(),
      _r.fabricatePost(),
    ]

    const normalizedPosts = posts.map(_r.normalize)

    const store = mockStore({})

    fetch.mockResponse(JSON.stringify({posts}))

    expect.assertions(2)
    return _r.fetchPosts().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('FETCH_POSTS_WIN')
        expect(action.payload.posts).toEqual(JSON.parse(JSON.stringify(normalizedPosts)))
      })
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oops", {status: 500})

    expect.assertions(1)
    return _r.fetchPosts().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('FETCH_POSTS_FAIL')
      })
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oh no you didn't", {status: 400})

    expect.assertions(1)
    return _r.fetchPosts().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('FETCH_POSTS_FAIL')
      })
  })
})

describe('fetchPostsWin', () => {
  it('updates the application state', () => {
    const state = {
      fetching: true,
      entities: []
    }

    const posts = [
      _r.fabricatePost(),
      _r.fabricatePost(),
      _r.fabricatePost(),
    ].map(_r.normalize)

    const action = _r.fetchPostsWin(posts)

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      fetching: false,
      entities: posts
    })
  })
})

describe('updatePost', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.updatePost)).toEqual('function')
    const action = _r.updatePost()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('updates the application state', () => {
    const state = {
      updating: null,
    }

    const post = _r.normalize(_r.fabricatePost())

    const action = {
      type: "UPDATE_POST",
      payload: post,
    }

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      updating: post,
    })

  })

  it('interacts with the API correctly (happy case)', () => {
    const store = mockStore({})

    fetch.mockResponse("bing!", {status: 200})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(2)
    return _r.updatePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('UPDATE_POST_WIN')
        expect(fetch).toBeCalledWith(
          '/api/posts/1',
          {
            method: 'PUT',
            body: JSON.stringify(_r.denormalize(post))
          }
        )
      })
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oops", {status: 500})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(1)
    return _r.updatePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('UPDATE_POST_FAIL')
      })
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oh no you didn't", {status: 400})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(1)
    return _r.updatePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('UPDATE_POST_FAIL')
      })
  })
})

describe('updatePostWin', () => {
  it('updates the application state', () => {
    const priorPost = _r.normalize(_r.fabricatePost())
    const post = _r.normalize(_r.fabricatePost())
    const nextPost = _r.normalize(_r.fabricatePost())
    const updatedPost = {...post, title: "You'll never believe..."}

    const state = {
      updating: updatedPost,
      entities: [
        priorPost,
        post,
        nextPost,
      ]
    }

    const action = _r.updatePostWin(updatedPost)

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      updating: null,
      entities: [
        priorPost,
        updatedPost,
        nextPost,
      ]
    })
  })
})


describe('addPost', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.addPost)).toEqual('function')
    const action = _r.addPost()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('interacts with the API correctly (happy case)', () => {
    const store = mockStore({})

    fetch.mockResponse("bing!", {status: 200})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(2)
    return _r.addPost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('ADD_POST_WIN')
        expect(fetch).toBeCalledWith(
          '/api/posts',
          {
            method: 'POST',
            body: JSON.stringify(
              [
                _r.denormalize(post)
              ]
            )
          }
        )
      })
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oops", {status: 500})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(1)
    return _r.addPost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('ADD_POST_FAIL')
      })
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oh no you didn't", {status: 400})

    const post = {
      id: 1,
      title: "Here be the title",
      content: "And the content"
    }

    expect.assertions(1)
    return _r.addPost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('ADD_POST_FAIL')
      })
  })
})

describe('addPostWin', () => {
  it('updates the application state', () => {
    const state = {
      entities: []
    }

    const post = _r.normalize(_r.fabricatePost())

    const action = _r.addPostWin(post)

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      entities: [
        post
      ]
    })
  })
})

describe('removePost', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.removePost)).toEqual('function')
    const action = _r.removePost()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('interacts with the API correctly (happy case)', () => {
    const store = mockStore({})

    fetch.mockResponse("nom nom nom", {status: 200})

    const post = _r.normalize(_r.fabricatePost())

    expect.assertions(2)
    return _r.removePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('REMOVE_POST_WIN')
        expect(fetch).toBeCalledWith(
          `/api/posts/${post.id}`,
          {
            method: 'DELETE',
          }
        )
      })
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oops", {status: 500})

    const post = _r.normalize(_r.fabricatePost())

    expect.assertions(1)
    return _r.removePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('REMOVE_POST_FAIL')
      })
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oh no you didn't", {status: 400})

    const post = _r.normalize(_r.fabricatePost())

    expect.assertions(1)
    return _r.removePost(post).payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('REMOVE_POST_FAIL')
      })
  })
})
