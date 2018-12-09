import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, Container, Row, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {fetchPOST} from '../utils/helpers';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import CommentsButtons from './CommentsButtons';

class Comment extends Component {
state = {
  all: true,
  approved: false,
  deleted: false,
  comments: [],
  commentLoaded: false
}

componentDidMount () {
  const {match, post} = this.props;
  const commentsArr = [];
  if (post !== null) {
    Object.values(post).map(obj => {
      fetchPOST('http://139.162.16.199:3141/fn/comments/getLinkedComments', obj.uuid)
        .then(comments => {
          if (comments.length > 0) {
            Object.values(comments).map(comment => comment.postTitle = obj.title);
            commentsArr.push(...comments);
          }
        }).then(() => {
          this.setState({
            comments: commentsArr.sort((a, b) =>
              a.Entry.createdAt < b.Entry.createdAt), commentLoaded: true
          });
        });
    });
  }
}

handleChange = (hash, parentId) => {
  fetchPOST('http://139.162.16.199:3141/fn/comments/commentDelete', {hash, parentId}).then(() => {
    this.setState({
      commentLoaded: true
    });
  });
}

handleClick(event) {
  if (event === 'all') {
    this.setState({
      all: true,
      approved: false,
      deleted: false
    });
  } else if (event === 'approved') {
    this.setState({
      all: false,
      approved: true,
      deleted: false
    });
  } else if (event === 'deleted') {
    this.setState({
      all: false,
      approved: false,
      deleted: true
    });
  }
}

render () {
  const {post, match} = this.props;
  const {comments, all, approved, deleted} = this.state;

  if (post === null) {
    return <p>There are no posts yet, <Link to='/compose'>start by making one!</Link> 😁</p>;
  }

  if (!comments.length) {
    return null;
  }

  const Heading = () => {
    if (all === true) {
      return <h3> All Comments </h3>;
    } else if (approved === true) {
      return <h3> Approved Comments </h3>;
    } else if (deleted === true) {
      return <h3> Deleted Comments </h3>;
    }
  };

  if (deleted === true) {
    const rendercomments = Object.values(comments).filter(comment => comment.Entry.deleted === deleted);
  } else if (approved === true) {
    const rendercomments = Object.values(comments).filter(comment => comment.Entry.deleted !== deleted);
  } else if (all === true) {
    const rendercomments = comments;
  }


  return (
    <React.Fragment>
      <div className="sub-header">
        <Container>
          <Row>
            <Col>
              <div className="form-group button-group float-right m-0">
                <button onClick={() => this.handleClick('all')} type="button" name="all" className="btn btn-light-green mr-1">ALL</button>
                <button onClick={() => this.handleClick('approved')} type="button" name="approved" className="btn btn-dark">APPROVED</button>
                <button onClick={() => this.handleClick('deleted')} type="button" name="deleted" className="btn btn-red-dark">DELETED</button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      <Container className="mt-5">
        <Heading />
        {Object.keys(comments).map(comment =>
          <Card key={comments[comment].Hash} className="mb-3" style={comments[comment].Entry.deleted === false ? {opacity: '1'} : {opacity: '0.5'}}>
            <Card.Header><small>{comments[comment].Entry.author} - <Moment interval={0} format="MM/DD/YYYY [at] h:mm A z">{comments[comment].Entry.createdAt}</Moment></small></Card.Header>
            <Card.Body>
              <Card.Text>
                {comments[comment].Entry.body}
              </Card.Text>
            </Card.Body>
            <div className="buttons-ft">
              {comments[comment].Entry.deleted === false && (
                <button type="button" className="btn btn-red-dark" onClick={() => this.handleChange(comments[comment].Hash, post.uuid)}>Delete</button>
              )}
            </div>
          </Card>
        )}
      </Container>
    </React.Fragment>
  );
}
}

Comment.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps({posts}, OwnProps) {
  if (typeof OwnProps.match.params.id === 'undefined') {
    const postsObj = Object.values(posts).sort((a, b) => a.lastupdate < b.lastupdate);
    return {post: postsObj ? postsObj : null};
  }
  const id = Object.keys(posts).filter(index => posts[index].hash === OwnProps.match.params.id);
  const post = posts[id];
  return {post: post ? posts[id] : null};
}

export default connect(mapStateToProps)(Comment);
