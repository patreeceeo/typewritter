import matter from "gray-matter"
import {createActions, handleActions} from "redux-actions"

class PostId {
  public static setCounter(count) {
    this.currentId = count
  }

  private static currentId: number = 0

  private value: number

  constructor(value = PostId.currentId++) {
    debugger
    this.value = value
  }

  public valueOf() {
    return this.value
  }

  public toJSON() {
    return this.value
  }
}

export interface IServerPost {
  post_with_metadata: string,
  file_path: string,
  id: PostId,
}

export interface INormalizedPost {
  title: string,
  content: string,
  id: PostId,
}


export const {
  fetchPosts,
  fetchPostsWin,
  fetchPostsFail,
  updatePost,
  updatePostWin,
  updatePostFail,
  addPost,
  addPostWin,
  addPostFail,
  removePost,
  removePostWin,
  removePostFail,
} = createActions({
  FETCH_POSTS: [
    () => (dispatch: any) => {
      return fetch('/api/posts', {method: "GET"})
        .then((response) => {
          if (response.ok) {
            return response.json()
              .then((json) => {
                PostId.setCounter(json.posts.length)
                const normalizedPosts = json.posts.map(normalize)
                return dispatch(fetchPostsWin(normalizedPosts))
              })
          } else {
            return dispatch(fetchPostsFail(response))
          }
        })
    },
    (payload: any) => ({ preThunkPayload: payload }),
  ],
  // TODO: maybe FETCH_POSTS_WIN should take care of normalizing?
  FETCH_POSTS_WIN: (normalizedPosts) => ({posts: normalizedPosts}),
  FETCH_POSTS_FAIL: (error) => error,
  UPDATE_POST: [
    (post) => (dispatch) => {
      return fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify(denormalize(post)),
      })
        .then((response) => {
          if (response.ok) {
            return dispatch(updatePostWin(post))
          } else {
            return dispatch(updatePostFail(response))
          }
        })
    },
    (payload) => ({ preThunkPayload: payload }),
  ],
  UPDATE_POST_WIN: (post) => ({post}),
  UPDATE_POST_FAIL: (error) => error,
  ADD_POST: [
    (post = normalize(fabricatePost())) => (dispatch) => {
      return fetch(`/api/posts`, {
        method: "POST",
        body: JSON.stringify(
          [
            denormalize(post)
          ]
        ),
      })
        .then((response) => {
          if (response.ok) {
            return dispatch(addPostWin(post))
          } else {
            return dispatch(addPostFail(response))
          }
        })
    },
    (payload) => ({ preThunkPayload: payload }),
  ],
  ADD_POST_WIN: (post) => ({post}),
  ADD_POST_FAIL: (error) => error,
  REMOVE_POST: [
    (post) => (dispatch) => {
      return fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            return dispatch(removePostWin(post))
          } else {
            return dispatch(removePostFail(response))
          }
        })
    },
    (payload) => ({ preThunkPayload: payload }),
  ],
  REMOVE_POST_WIN: (post) => ({post}),
  REMOVE_POST_FAIL: (error) => error,
})

// Trying to structure state similarly to https://github.com/paularmstrong/normalizr


function arrayReplace(array, index, newElement) {
  return [...array.slice(0, index), newElement, ...array.slice(index + 1)]
}

function arrayRemove(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

// Returns new state object with the corresponding `post` updated
function localUpdatePost(state, newPost) {
  const index = state.entities.findIndex(isSamePost(newPost))

  if(index >= 0) {
    const value = {
      ...state,
      entities: arrayReplace(state.entities, index, newPost),
    }
    return value
  } else {
    // TODO: track error
    return state
  }
}

function localRemovePost(state, post) {
  const index = state.entities.findIndex(isSamePost(post))

  if(index >= 0) {
    const value = {
      ...state,
      entities: arrayRemove(state.entities, index),
    }
    return value
  } else {
    // TODO: track error
    return state
  }
}

const defaultState = {
  fetching: false,
  updating: false,
  entities: [],
}

const reducer: (state: any, action: any) => any = handleActions({
  [fetchPosts]: (state) => ({
    ...state,
    fetching: true,
  }),
  [fetchPostsWin]: (state, {payload}) => ({
    ...state,
    entities: [...payload.posts],
    fetching: false,
  }),
  [fetchPostsFail]: (state, {payload}) => ({
    ...state,
    fetching: false,
    error: payload,
  }),
  [updatePost]: (state, {payload}) => ({
    ...state,
    updating: payload,
  }),
  [updatePostWin]: (state, {payload}) => ({
    ...localUpdatePost(state, payload.post),
    updating: null,
  }),
  [updatePostFail]: (state) => ({
    ...state,
    updating: null,
  }),
  [addPostWin]: (state, {payload}) => ({
    ...state,
    entities: [...state.entities, payload.post]
  }),
  [removePostWin]: (state, {payload}) => ({
    ...localRemovePost(state, payload.post)
  }),
}, defaultState)

export default reducer

// TODO: use Saga?

// collection functions
export function getPostById(posts, postId) {
  return posts.filter((post) => post.id === postId)[0]
}

// specific functions
export function normalize({post_with_metadata, id, ...post}): INormalizedPost {
  const parsed = matter(post_with_metadata)

  interface IData {
    title: string
  }

  return {
    ...post,
    title: (parsed.data as IData).title,
    id,
    content: parsed.content,
  }
}

export function denormalize({title, content, id, ...stuff}): IServerPost {
  return {
    id,
    post_with_metadata: matter.stringify(content, {title}),
    file_path: stuff.file_path,
    ...stuff,
  }
}

export function fabricatePost(id: PostId = new PostId()): IServerPost {
  return {
    post_with_metadata: matter.stringify("And the content", {
      title: "This is the title",
    }),
    id: id,
    file_path: `${id}.md`
  }
}

export function getKey(post) {
  return post.id
}

export function getTitle(post) {
  return post.title
}

export function getExerpt(post) {
  // Note: gray-matter has support for excerpts
  return post.content.length >= 120 ? post.content.substr(0, 119) + '…' : post.content
}

export function getRawContent(post) {
  return post.content
}

export function updateRawContent(post, content) {
  post.content = content
}

export function getDetailUrl(post) {
  return `/posts/${post.id}`
}

export function getEditUrl(post) {
  return `/posts/${post.id}/edit`
}

export function isSamePost(post) {
  return (otherPost) => {
    return post.id.valueOf() === otherPost.id.valueOf()
  }
}
