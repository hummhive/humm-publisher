import {receivePosts, addNewPost, deletePost, editPost} from './posts';
import {receiveAgent} from './agent';
import {showLoading, hideLoading} from 'react-redux-loading-bar';
import axios from 'axios';

export function handleInitialData() {
  return dispatch => {
    dispatch(showLoading());
    return axios.post('/fn/posts/GetPostsByStatus', JSON.stringify('any'))
      .then(entries => {
        dispatch(receivePosts(entries.data));
      }).catch(err => {
        //console.error('Error Handling Intial Post Data:', err);
      })
      .then(() => axios.post('/fn/posts/GetAgentInfo'))
      .then(agent => {
        dispatch(receiveAgent(agent.data));
      }).catch(err => {
        //console.error('Error Handling Intial Agent Data:', err);
      })
      .then(() => dispatch(hideLoading()));
  };
}

export function newPostDispatch(title, author, pubdate, lastupdate, tags, content, status) {
  return dispatch => axios.post('/fn/posts/CreatePost', {title, tags, content, status})
    .then(response => {
      dispatch(addNewPost(response.data.hash, response.data.uuid, title, author, pubdate, lastupdate, tags, content, status));
    }).catch(err => {
      // console.error('Error Creating Post: ', err);
    });
}

export function deletePostDispatch(hash, status) {
  return dispatch => axios.post('/fn/posts/DeletePost', {hash, status})
    .then(response => {
      dispatch(deletePost(hash));
    }).catch(err => {
      // console.error('Error Deleting Post: ', err);
    });
}

export function editPostDispatch(prevHash, uuid, title, author, pubdate, lastupdate, tags, content, status) {
  return dispatch => axios.post('/fn/Posts/EditPost', {hash: prevHash, uuid, title, tags, content, status})
    .then(response => {
      dispatch(editPost(response.data.hash, uuid, title, author, pubdate, lastupdate, tags, content, status, prevHash));
    }).catch(err => {
      // console.error('Error Editing Post: ', err);
    });
}
