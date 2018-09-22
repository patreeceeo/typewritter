import matter from 'gray-matter'

export function normalize({post_with_metadata, ...post}) {
  const parsed = matter(post_with_metadata)
  return {
    ...post,
    ...parsed.data,
    content: parsed.content
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

export function getDetailUrl(post) {
  return `/posts/${post.id}`
}
