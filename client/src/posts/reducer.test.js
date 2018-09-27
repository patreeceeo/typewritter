import * as _r from './reducer'
import {isFSA} from 'flux-standard-action'
import configureMockStore from 'redux-mock-store'
import FsaThunk from 'fsa-redux-thunk'

const mockStore = configureMockStore([FsaThunk])

describe('fetchPosts', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.fetchPosts)).toEqual('function')
    const action = _r.fetchPosts()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('interacts with the API correctly (happy case)', () => {
    const posts = [
      _r.denormalize(_r.fabricatePost(1)),
      _r.denormalize(_r.fabricatePost(2))
    ]

    const normalizedPosts = posts.map(_r.normalize)

    const store = mockStore({})

    fetch.mockResponse(JSON.stringify({posts}))

    _r.fetchPosts().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('FETCH_POSTS_WIN')
        expect(action.payload.posts).toEqual(normalizedPosts)
      })

    expect(fetch.mock.calls[0][0]).toEqual('/api/posts')
  })
})
