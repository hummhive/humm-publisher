export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const ADD_POST = 'ADD_POST'
export const DELETE_POST = 'DELETE_POST'

export function receivePosts (posts) {
  return {
    type: RECEIVE_POSTS,
    posts
  }
}

export function addNewPost (post) {
  return {
    type: ADD_POST,
    post
  }
}

export function deletePost(post) {
  return {
    type: DELETE_POST,
    post
  }
}
