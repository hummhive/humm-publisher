import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {Link, Redirect, withRouter} from 'react-router-dom';
import {deletePostDispatch} from '../actions';
import Moment from 'react-moment';

class Post extends Component {
    handleChange = () => {
      const {dispatch, post} = this.props;
      if (post !== null) {
        const path = '/post/';
        dispatch(deletePostDispatch(post.hash, post.status)).then(() =>
          this.props.history.push(path)
        );
      }
    }

    render () {
      const {post, match, location} = this.props;

      if (post === null) {
        return <p>There are no posts yet, <Link to='/compose'>start by making one!</Link></p>;
      }

      if (typeof match.params.id === 'undefined' && post !== null) {
        return <Redirect push to={{pathname: `/post/${post.hash}`, state: {referrer: typeof location.state !== 'undefined' && location.state.referrer === 'updated' ? 'updated' : null}}} />;
      }

      return (
        <React.Fragment>
          {typeof location.state !== 'undefined' && location.state.referrer === 'updated' && (
            <Alert variant='primary'>The post has been updated, and the hash replaced</Alert>
          )}
          <div id="post-actions" className="toolbar float-right">
            <Link to={`/compose/${post.hash}`}><button id="editPost" type="button" className="btn btn-outline-primary btn-sm mr-2">Edit</button></Link>
            <button id="deletePost" type="button" className="btn btn-outline-dark btn-sm" onClick={this.handleChange}>Mark as Deleted</button>
          </div>
          <h1 id="thePost-title">{post.title}</h1>
          <p><small>Published on: <Moment format="MMMM D, YYYY [at] h:mm A z">{post.pubdate}</Moment></small></p>
          <div dangerouslySetInnerHTML={{__html: post.content}} />
        </React.Fragment>
      );
    }
}

Post.propTypes = {
  dispatch: PropTypes.func,
  agent: PropTypes.object,
  history: PropTypes.object,
  post: PropTypes.object,
  match: PropTypes.object,
  location: PropTypes.object
};

function mapStateToProps({posts}, OwnProps) {
  if (typeof OwnProps.match.params.id === 'undefined') {
    const postsObj = Object.values(posts).sort((a, b) => a.lastupdate < b.lastupdate);
    return {post: postsObj[0] ? postsObj[0] : null};
  }
  const id = Object.keys(posts).filter(index => posts[index].hash === OwnProps.match.params.id);
  const post = posts[id];
  return {post: post ? posts[id] : null};
}

export default withRouter(connect(mapStateToProps)(Post));
