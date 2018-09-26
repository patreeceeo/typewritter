import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import rootReducer from './reducer'
import {createStore, applyMiddleware} from 'redux'
import {Provider} from 'react-redux'
import FsaThunk from 'fsa-redux-thunk'

const store = createStore(
  rootReducer,
  applyMiddleware(FsaThunk)
)

renderApp(window.location.pathname) //render page the first time

window.addEventListener('popstate', function () {
  //render page when path changes
  renderApp(window.location.pathname)
})

function renderApp(path) {
  ReactDOM.render(
    <Provider store={store}>
      <App path={path}/>
    </Provider>,
    document.getElementById('root')
  )
}
