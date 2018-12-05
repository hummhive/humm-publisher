import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Badge} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {NavLink, withRouter} from 'react-router-dom';
import Moment from 'react-moment';

class PostList extends Component {
  render () {
    const {postlist, match, label} = this.props;
    return (
      <div>
        {postlist.map(post =>
          <NavLink key={post.hash} id={post.hash} to={`/compose/${post.hash}`}
            className={'list-group-item list-group-item-action align-items-start'}>
            <h5 className="mb-1">{post.title}</h5>
            <span className={post.status === 'publish' ? 'publish-status' : 'draft-status'}> {post.status === 'publish' ? 'published' : 'drafted'}</span>
            <small><Moment interval={0} format="MM/DD/YYYY [at] h:mm A z">{post.lastupdate}</Moment></small>
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
  let postsObj = Object.keys(posts).map(post => ({
    hash: posts[post].hash,
    title: posts[post].title,
    status: posts[post].status,
    lastupdate: posts[post].lastupdate
  }));

  if (OwnProps.status) {
    postsObj = postsObj.filter(post => post.status === OwnProps.status);
  }

  postsObj.sort((a, b) => a.lastupdate < b.lastupdate);

  return {postlist: postsObj};
}

export default withRouter(connect(mapStateToProps)(PostList));
