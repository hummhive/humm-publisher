import { receivePosts, addNewPost, deletePost, editPost }  from './posts';
import { receiveAgent }  from './agent';
import { fetchPOST } from '../utils/helpers'
import { showLoading, hideLoading } from 'react-redux-loading-bar'

export function handleInitialData() {
  return (dispatch) => {
    dispatch(showLoading())
    return fetchPOST('/fn/Posts/GetPostsByStatus', "any")
    .then(entries => {dispatch(receivePosts(entries))}).catch( err => {console.error( 'Error Handling Intial Post Data:', err );})
    .then(() => fetchPOST('/fn/Posts/GetAgentInfo'))
    .then(agent => {dispatch(receiveAgent(agent)) }).catch( err => {console.error( 'Error Handling Intial Agent Data:', err );})
    .then(() => dispatch(hideLoading()))
  }
}

export function newPostDispatch(title, author, pubdate, lastupdate, tags, content, status) {
  return (dispatch) => {
    return fetchPOST('/fn/Posts/CreatePost', {title, tags, content, status})
    .then(response => {dispatch(addNewPost(response.hash, response.uuid, title, author, pubdate, lastupdate, tags, content, status))}).catch( err => {console.error( 'Error Creating Post: ', err );})
  }
}

export function deletePostDispatch(hash, status){
  return (dispatch) =>{
    return fetchPOST('/fn/Posts/DeletePost', {hash, status})
    .then(response => {dispatch(deletePost(hash))}).catch( err => {console.error( 'Error Deleting Post: ', err );})
  }
}

export function editPostDispatch(prevHash, uuid, title, author, pubdate, lastupdate, tags, content, status){
  return (dispatch) =>{
    return fetchPOST('/fn/Posts/EditPost', {"hash": prevHash, uuid, title, tags, content, status})
    .then(response => {dispatch(editPost(response.hash, uuid, title, author, pubdate, lastupdate, tags, content, status, prevHash))}).catch( err => {console.error( 'Error Editing Post: ', err );})
  }
}
