import { combineReducers } from 'redux';
import agent from './agent';
import { loadingBarReducer } from 'react-redux-loading-bar';
import questions from './questions';

export default combineReducers({
  agent,
  questions,
  loadingBar: loadingBarReducer
});
