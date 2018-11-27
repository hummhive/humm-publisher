import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {fetchPOST} from '../utils/helpers';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';

class Comment extends Component {
state = {
  hash: null,
  comments: [],
  commentLoaded: false
}

componentDidMount () {
  const {match, post} = this.props;
  if (typeof match.params.id !== 'undefined' && post !== null && post.hash === match.params.id) {
    fetchPOST('/fn/comments/getLinkedComments', post.uuid)
      .then(comments => {
        this.setState({
          comments: Object.values(comments).sort((a, b) =>
            a.Entry.createdAt < b.Entry.createdAt),
          hash: post.hash, commentLoaded: true
        });
      });
    // .catch(error => console.log(error));
  }
}

componentDidUpdate(prevProps, prevState) {
  const {match, post} = this.props;
  if (typeof match.params.id !== 'undefined' && post !== null && post.hash === match.params.id &&
  post.hash !== prevState.hash || prevState.commentLoaded !== this.state.commentLoaded) {
    fetchPOST('/fn/comments/getLinkedComments', post.uuid)
      .then(comments => {
        this.setState({
          comments: Object.values(comments).sort((a, b) =>
            a.Entry.createdAt < b.Entry.createdAt),
          hash: post.hash, commentLoaded: false
        });
      });
    // .catch(error => console.log(error));
  }
}

handleChange = (hash, parentId) => {
  fetchPOST('/fn/comments/commentDelete', {hash, parentId}).then(() => {
    this.setState({
      commentLoaded: true
    });
  });
}


render () {
  const {post, match} = this.props;
  const {comments} = this.state;

  if (post === null) {
    return <p>There are no posts yet, <Link to='/compose'>start by making one!</Link> 😁</p>;
  }

  if (typeof match.params.id === 'undefined') {
    return <p>Please select one of the posts from the sidebar</p>;
  }

  if (comments.length === 0) {
    return <p>This post does not have any comments! 😥</p>;
  }

  return (
    <React.Fragment>
      {Object.keys(comments).map(comment =>
        <Card key={comments[comment].Entry.hash} className="mb-3" style={comments[comment].Entry.deleted === false ? {opacity: '1'} : {opacity: '0.5'}}>
          <Card.Header><small>{comments[comment].Hash} - <Moment interval={0} format="MM/DD/YYYY [at] h:mm A z">{comments[comment].Entry.createdAt}</Moment></small></Card.Header>
          <Card.Body>
            <Card.Title>{comments[comment].Entry.author} Said:</Card.Title>
            <Card.Text>
              {comments[comment].Entry.body}
            </Card.Text>
            {comments[comment].Entry.deleted === false && (
              <button type="button" className="btn btn-outline-dark btn-sm" onClick={() => this.handleChange(comments[comment].Hash, post.uuid)}>Mark as Deleted</button>
            )}
          </Card.Body>
        </Card>
      )}

    </React.Fragment>
  );
}
}

Comment.propTypes = {
  post: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
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

export default connect(mapStateToProps)(Comment);
