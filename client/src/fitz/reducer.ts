import {createActions, handleActions} from "redux-actions"

export const {
  startBuild,
  startBuildWin,
  startBuildFail
} = createActions({
  START_BUILD: [
    () => (dispatch) => {
      return fetch('/api/build', {method: 'POST'})
        .then((response) => {
          if (response.ok) {
            return response.json()
              .then((json) => {
                return dispatch(startBuildWin({stdout: json.stdout}))
              })
          } else {
            return dispatch(startBuildFail(response))
          }
        })
    },
    (payload: any) => ({ preThunkPayload: payload }),
  ],
  START_BUILD_WIN: (payload) => payload,
  START_BUILD_FAIL: (error) => error,
})

const defaultState = {
  building: false,
}

const reducer: (state: any, action: any) => any = handleActions({
  [startBuild]: (state) => ({
    ...state,
    building: true,
  }),
  [startBuildWin]: (state,  {payload}) => ({
    ...state,
    building: false,
    stdout: payload.stdout
  })
}, defaultState)

export default reducer
