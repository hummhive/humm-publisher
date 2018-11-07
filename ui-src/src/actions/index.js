import { receiveQuestions }  from './questions';
import { addNewQuestion }  from './questions';
import { receiveAgent }  from './agent';
import { fetchPOST } from '../utils/helpers'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

export function handleInitialData() {
  return (dispatch) => {
    dispatch(showLoading())
    return fetchPOST('/fn/Posts/GetPublicPosts')
    .then(entries => {
      dispatch(receiveQuestions(entries))
      dispatch(hideLoading());
      })
  }
}

export function newQuestionHandler(title, content) {
  return (dispatch) => {
    return fetchPOST('/fn/Posts/CreatePost', {"title" : title, "content" : content})
    .then(data => fetchPOST('/fn/Posts/GetPublicPosts'))
    .then(entries => dispatch(receiveQuestions(entries)))
  }
}
