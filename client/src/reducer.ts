import { combineReducers } from 'redux'
import postsReducer from './posts/reducer'
import fitzReducer from './fitz/reducer'

export default combineReducers({
  posts: postsReducer,
  fitz: fitzReducer,
})
