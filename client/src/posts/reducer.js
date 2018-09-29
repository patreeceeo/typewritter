import matter from 'gray-matter'
import {createActions, handleActions} from 'redux-actions'

export const {
  fetchPosts,
  fetchPostsWin,
  fetchPostsFail,
  updatePost,
  updatePostWin,
  updatePostsFail
} = createActions({
  FETCH_POSTS: [
    () => (dispatch) => {
      return fetch('/api/posts', {method: "GET"})
        .then((response) => {
          if(response.ok) {
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
    (payload) => ({ preThunkPayload: payload })
  ],
  // TODO: maybe FETCH_POSTS_WIN should take care of normalizing?
  FETCH_POSTS_WIN: (normalizedPosts) => ({posts: normalizedPosts}),
  FETCH_POSTS_FAIL: (error) => error,
  UPDATE_POST: [
    (post) => (dispatch) => {
      return fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify(denormalize(post))
      })
        .catch((err) => {
          dispatch(updatePostsFail(err))
          // throw err
        })
        .then(() => {
          return dispatch(updatePostWin(post))
        })
    },
    (payload) => ({ preThunkPayload: payload })
  ],
  UPDATE_POST_WIN: (post) => ({post}),
  UPDATE_POST_FAIL: (error) => error
  // ADD_POST: (post = fabricatePost()) => ({post}),
  // UPDATE_POST: (postId, post) => ({postId, post}),
  // REMOVE_POST: (postId) => ({postId})
})

// Trying to structure state similarly to https://github.com/paularmstrong/normalizr

// Returns new state object with the corresponding `post` updated
function localUpdatePost(state, newPost) {
  const newEntities = [...state.entities.filter(({id}) => id === newPost.id), newPost]
  return {
    ...state,
    entities: newEntities
  }
}

const defaultState = {
  fetching: false,
  updating: false,
  entities: []
}

export default handleActions({
  [fetchPosts]: (state) => ({
    ...state,
    fetching: true
  }),
  [fetchPostsWin]: (state, {payload}) => ({
    ...state,
    entities: [...payload.posts],
    fetching: false
  }),
  [fetchPostsFail]: (state, {payload}) => ({
    ...state,
    fetching: false,
    error: payload
  }),
  [updatePost]: (state, {payload}) => ({
    ...state,
    updating: payload.post
  }),
  [updatePostWin]: (state, {payload}) => ({
    ...localUpdatePost(state, payload.post),
    updating: null
  }),
  [updatePostsFail]: (state) => ({
    ...state,
    updating: null
  }),
}, defaultState)

// export default function postsReducer(posts = [], action) {
//   switch(action.type) {
//   case 'UPDATE_POST_RAW_CONTENT': {
//     const post = getPostById(posts, action.postId)
//     updateRawContent(post, action.content)
//   }
//   }
// }

// TODO: use Saga?

// collection functions
export function getPostById(posts, postId) {
  return posts.filter((post) => post.id === postId)[0]
}


// specific functions
export function normalize({post_with_metadata, ...post}) {
  const parsed = matter(post_with_metadata)
  return {
    ...post,
    ...parsed.data,
    content: parsed.content
  }
}

export function denormalize({title, content, ...stuff}) {
  return {
    post_with_metadata: matter.stringify(content, {title}),
    ...stuff
  }
}

export function fabricatePost(id) {
  return {
    title: "This is the title",
    content: "This is some content",
    id: id
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
