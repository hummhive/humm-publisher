import { RECEIVE_POSTS, DELETE_POST } from '../actions/posts';

export default function posts(state = {}, action) {
  switch (action.type) {
  case RECEIVE_POSTS:
    return {
      ...state,
      ...action.posts,
    };

    case DELETE_POST:
    const newState = Object.assign([], state);
    const indexToDelete = Object.keys(state).findIndex(post => {
       return post.hash == action.hash
     })
    newState.splice(indexToDelete, 1);
    return newState;

  default:
    return state;
  }
}
