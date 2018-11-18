export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const ADD_POST = 'ADD_POST'
export const DELETE_POST = 'DELETE_POST'
export const EDIT_POST = 'EDIT_POST'

export function receivePosts (posts) {
  return {
    type: RECEIVE_POSTS,
    posts
  }
}

export function addNewPost (hash, uuid, title, author, pubdate, lastupdate, tags, content, status) {
  return {
    type: ADD_POST,
    post: {
    hash,
    uuid,
    title,
    author,
    pubdate,
    lastupdate,
    tags,
    content,
    status
  }
  }
}

export function editPost (hash, uuid, title, author, pubdate, lastupdate, tags, content, status, prevHash) {
  return {
    type: EDIT_POST,
    post: {
    hash,
    uuid,
    title,
    author,
    pubdate,
    lastupdate,
    tags,
    content,
    status,
    prevHash
  }
  }
}

export function deletePost(hash) {
  return {
    type: DELETE_POST,
    hash
  }
}
