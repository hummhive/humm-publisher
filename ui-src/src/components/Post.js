import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import { Link, Redirect, withRouter } from 'react-router-dom'
import { newPostDispatch, deletePostDispatch } from '../actions'

class Post extends Component {


    handleChange = () => {
      const { dispatch, post, match, history } = this.props
      if(post !== null){
      const path = `/post/${match.params.status}`
      dispatch(deletePostDispatch(post.hash, post.status)).then(() =>
      this.props.history.push(path)
      )
      }
    }

    render () {

      const { post, match } = this.props

      if (post === null) {
        return <p>There are no posts yet, <Link to='/compose'>start by making one!</Link></p>
      }

    if (typeof match.params.id === "undefined" && post !== null) {
      return <Redirect to={{ pathname: `/post/${post.hash}` }}  />
    }

    return (
      <div>
      <div id="post-actions" className="toolbar float-right">
        <Link to={`/compose/${post.hash}`}><button id="editPost" type="button" className="btn btn-outline-primary btn-sm mr-2">Edit</button></Link>
        <button id="deletePost" type="button" className="btn btn-outline-dark btn-sm" onClick={this.handleChange}>Mark as Deleted</button>
      </div>
      <h1 id="thePost-title">{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
      </div>
    )
  }
}

function mapStateToProps({posts}, OwnProps){

  if(typeof OwnProps.match.params.id === "undefined" && Object.keys(posts).length !== 0 ){
    const postsObj = Object.values(posts).sort((a, b) => a.pubdate < b.pubdate);
    return {post : posts[0] ? posts[0] : null};
    }else{
    const id = Object.keys(posts).filter(id => posts[id].hash === OwnProps.match.params.id)
    const post = posts[id]
    return {post: post ? posts[id] : null};
  }
}

export default connect(mapStateToProps)(Post)
