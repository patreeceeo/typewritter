import {createActions, handleActions} from "redux-actions"

export const {
  startBuild,
  startBuildWin,
  receivedBuildMessage,
  buildFinished,
  startBuildFail
} = createActions({
  START_BUILD: [
    () => (dispatch) => {
      // NOTE: something about create-react-app's proxying
      // causes events to not be received in real-time.
      // There's probably some buffering happening in the
      // webpack-dev-server code.

      const source = new EventSource("/api/build")
      source.addEventListener("started", (event) => {
        dispatch(startBuildWin())
      })

      source.addEventListener("message", (event) => {
        dispatch(receivedBuildMessage((event as any).data))
      })

      source.addEventListener("finished", (event) => {
        dispatch(buildFinished(parseInt((event as any).data, 10)))
        source.close()
      })

      source.addEventListener("error", (event) => {
        dispatch(startBuildFail(event))
        source.close()
      })
    },
    (payload: any) => ({ preThunkPayload: payload }),
  ],
  START_BUILD_WIN: () => undefined,
  RECEIVED_BUILD_MESSAGE: (payload) => payload,
  BUILD_FINISHED: (payload) => payload,
  START_BUILD_FAIL: (error) => error,
})

const defaultState = {
  building: false,
  stdout: "",
  exitCode: undefined,
  error: undefined,
}

const reducer: (state: any, action: any) => any = handleActions({
  [startBuild]: (state) => ({
    ...state,
    building: true,
  }),
  [receivedBuildMessage]: (state,  {payload}) => ({
    ...state,
    stdout: state.stdout + payload + "\n",
  }),
  [buildFinished]: (state, {payload}) => ({
    ...state,
    building: false,
    exitCode: payload,
  }),
  [startBuildFail]: (state, {payload}) => ({
    ...state,
    building: false,
    error: payload,
  })
}, defaultState)

export default reducer
