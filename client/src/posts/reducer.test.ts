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

  it('interacts with the API correctly (happy case)', () => {
    const posts = [
      _r.fabricatePost(1),
      _r.fabricatePost(2),
    ]

    const normalizedPosts = posts.map(_r.normalize)

    const store = mockStore({})

    fetch.mockResponse(JSON.stringify({posts}))

    expect.assertions(2)
    return _r.fetchPosts().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('FETCH_POSTS_WIN')
        expect(action.payload.posts).toEqual(normalizedPosts)
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

describe('updatePost', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.updatePost)).toEqual('function')
    const action = _r.updatePost()
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



