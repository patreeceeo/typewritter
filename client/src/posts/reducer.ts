import matter from "gray-matter"
import {createActions, handleActions} from "redux-actions"


export interface IServerPost {
  post_with_metadata: string,
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
            return dispatch(updatePostWin())
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
            return dispatch(addPostWin())
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

class PostId {
  private static currentId: number = 0
  private value: number

  constructor(value = PostId.currentId) {
    this.value = value
    PostId.currentId++
  }

  public valueOf() {
    return this.value
  }

  public toJSON() {
    return this.value
  }
}

// Returns new state object with the corresponding `post` updated
function localUpdatePost(state, newPost) {
  const newEntities = [...state.entities.filter(({id}) => id === newPost.id), newPost]
  return {
    ...state,
    entities: newEntities,
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
    updating: payload.post,
  }),
  [updatePostWin]: (state, {payload}) => ({
    ...localUpdatePost(state, payload.post),
    updating: null,
  }),
  [updatePostFail]: (state) => ({
    ...state,
    updating: null,
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
    ...stuff,
  }
}

export function fabricatePost(id: PostId = new PostId()): IServerPost {
  return {
    post_with_metadata: matter.stringify("And the content", {
      title: "This is the title",
    }),
    id: id,
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


