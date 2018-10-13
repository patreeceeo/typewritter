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

describe('startBuild', () => {
  it('is an FSA-compliant Thunk action creator', () => {
    expect(typeof(_r.startBuild)).toEqual('function')
    const action = _r.startBuild()
    expect(isFSA(action)).toBe(true)
    expect(typeof(action.payload)).toBe('function')
  })

  it('updates the application state', () => {
    const state = {
      building: false,
    }

    const action = _r.startBuild()

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      building: true,
    })
  })

  it('interacts with the API correctly (happy case)', () => {
    const store = mockStore({})

    const stdout = "So we beat on, boats against the current, borne back ceaselessly into the past."

    fetch.mockResponse(JSON.stringify({stdout}))

    expect.assertions(2)
    return _r.startBuild().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('START_BUILD_WIN')
        expect(action.payload.stdout).toEqual(stdout)
      })
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oops", {status: 500})

    expect.assertions(1)
    return _r.startBuild().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('START_BUILD_FAIL')
      })
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    fetch.mockResponse("oh no you didn't", {status: 400})

    expect.assertions(1)
    return _r.startBuild().payload(store.dispatch)
      .then((action) => {
        expect(action.type).toEqual('START_BUILD_FAIL')
      })
  })
})


describe('startBuildWin', () => {
  it('updates the application state', () => {
    const state = {
      building: true
    }

    const action = _r.startBuildWin({stdout: "Hi"})

    const nextState = _r.default(state, action)

    expect(nextState).toEqual({
      building: false,
      stdout: "Hi"
    })
  })
})
