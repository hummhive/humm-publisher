import React, {Component} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {NavLink, withRouter} from 'react-router-dom';
import Moment from 'react-moment';

class PostList extends Component {
  render () {
    const {postlist} = this.props;
    return (
      <div className="postlist-container">
        {postlist.map(post =>
          <NavLink key={post.hash} id={post.hash} to={`/compose/${post.hash}`}
            className={'list-group-item list-group-item-action align-items-start'}>
            <h5 className="mb-1">{post.title}</h5>
            <span className={post.status === 'publish' ? 'publish-status' : 'draft-status'}> {post.status === 'publish' ? 'published' : 'drafted'}</span>
            <Moment interval={0} format="MMM. D, YYYY.">{post.lastupdate}</Moment> {post.wordcount} words
          </NavLink>
        )}
      </div>
    );
  }
}

PostList.propTypes = {
  postlist: PropTypes.array,
  match: PropTypes.object
};

function mapStateToProps({posts}, OwnProps) {
  let postsObj = Object.values(posts).map(post => ({
    hash: post.hash,
    title: post.title,
    status: post.status,
    lastupdate: post.lastupdate,
    wordcount: post.content.trim().split(/\s+/).length
  }));

  if (OwnProps.status) {
    postsObj = postsObj.filter(post => post.status === OwnProps.status);
  }

  postsObj = Object.values(postsObj).sort((a, b) => a.lastupdate < b.lastupdate);

  return {postlist: postsObj};
}

export default withRouter(connect(mapStateToProps)(PostList));
