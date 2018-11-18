import {RECEIVE_POSTS, DELETE_POST, EDIT_POST, ADD_POST} from '../actions/posts';

export default function posts(state = {}, action) {
  const newState = Object.assign([], state);
  let indexToDelete;
  switch (action.type) {
    case RECEIVE_POSTS:
      return {
        ...state,
        ...action.posts
      };

    case ADD_POST:
      newState.splice(Object.keys(newState).length, 0, action.post);
      return newState;

    case DELETE_POST:
      indexToDelete = Object.keys(state).findIndex(post => state[post].hash === action.hash);
      newState.splice(indexToDelete, 1);
      return newState;

    case EDIT_POST:
      indexToDelete = Object.keys(state).findIndex(post => state[post].hash === action.post.prevHash);
      newState[indexToDelete] = action.post;
      return newState;

    default:
      return state;
  }
}
