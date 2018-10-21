import * as _r from './reducer'
import {isFSA} from 'flux-standard-action'
import configureMockStore from 'redux-mock-store'
import FsaThunk from 'fsa-redux-thunk'
import xhr from '../mock-xhr'

const mockStore = configureMockStore([FsaThunk])

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

    expect.assertions(1)

    _r.startBuild().payload(store.dispatch)

    /*
     * The text/event-stream MIME type is very specific
     * - There should be no blank line at the start
     * - Each event should be separated by 1 blank line
     * - The complete response must end with a blank line
     * - The event field is optional, but the data field is required
     *
     * https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
     */
    xhr.mockResponse([
`event: started
data: none
`,
`
data: So we beat on,

data: boats against the current,
`,
`
data: borne back ceaselessly into the past.
`,
`
event: finished
data: 0

`,
    ], {
      "Content-Type": "text/event-stream"
    })

    expect(store.getActions()).toEqual([
      _r.startBuildWin(),
      _r.receivedBuildMessage('So we beat on,'),
      _r.receivedBuildMessage('boats against the current,'),
      _r.receivedBuildMessage('borne back ceaselessly into the past.'),
      _r.buildFinished(0),
    ])
  })

  it('interacts with the API correctly (server error)', () => {
    const store = mockStore({})

    expect.assertions(1)
    _r.startBuild().payload(store.dispatch)

    xhr.mockResponse(["oops"], {status: 500})

    expect(store.getActions()).toEqual([
      _r.startBuildFail(expect.anything()),
    ])
  })

  it('interacts with the API correctly (client error)', () => {
    const store = mockStore({})

    expect.assertions(1)
    _r.startBuild().payload(store.dispatch)

    xhr.mockResponse(["oops"], {status: 400})

    expect(store.getActions()).toEqual([
      _r.startBuildFail(expect.anything()),
    ])
  })
})


describe('receivedBuildMessage', () => {
  it('updates the application state', () => {
    const state = {
      stdout: ""
    }

    const action1 = _r.receivedBuildMessage("Doing it")
    const action2 = _r.receivedBuildMessage("Done")

    const state1 = _r.default(state, action1)
    const state2 = _r.default(state1, action2)


    expect(state2).toEqual({
      stdout: "Doing it\nDone\n"
    })
  })
})

describe('buildFinished', () => {
  it('updates the application state', () => {
    const state = {
      building: true
    }

    const action1 = _r.buildFinished(0)

    const state1 = _r.default(state, action1)

    expect(state1).toEqual({
      building: false,
      exitCode: 0
    })
  })
})
