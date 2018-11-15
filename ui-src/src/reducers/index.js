import { combineReducers } from 'redux';
import agent from './agent';
import { loadingBarReducer } from 'react-redux-loading-bar';
import posts from './posts';

export default combineReducers({
  agent,
  posts,
  loadingBar: loadingBarReducer
});
