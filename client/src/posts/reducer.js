import matter from 'gray-matter'

// TODO: write reducer
// use Saga?

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
