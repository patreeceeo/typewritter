import {fetchPosts} from './reducer'
import {isFSA} from 'flux-standard-action'

describe('fetchPosts', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(fetchPosts)).toEqual('function')
    const action = fetchPosts()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })
})
