import { RECEIVE_POSTS, DELETE_POST, EDIT_POST, ADD_POST } from '../actions/posts';

export default function posts(state = {}, action) {
  switch (action.type) {
  case RECEIVE_POSTS:
    return {
      ...state,
      ...action.posts,
    };

    case ADD_POST:
    let newArray = Object.assign([], state);
    newArray.splice(Object.keys(newArray).length, 0, action.post)
    return newArray

    case DELETE_POST:
    let newState = Object.assign([], state);
    let indexToDelete = Object.keys(state).findIndex(post => {
       return state[post].hash === action.hash
     })
    newState.splice(indexToDelete, 1);
    return newState;

    case EDIT_POST:
    newState = Object.assign([], state);
    indexToDelete = Object.keys(state).findIndex(post => {
       return state[post].hash === action.post.prevHash
     })
    newState[indexToDelete] = action.post
    return newState;

  default:
    return state;
  }
}
