import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Card, Container, Row, Col, Alert} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {fetchPOST} from '../utils/helpers';
import {Link} from 'react-router-dom';
import Moment from 'react-moment';
import caret from '../images/caret.png';

class Comment extends Component {
state = {
  all: true,
  approved: false,
  deleted: false,
  comments: [],
  approvedComments: [],
  deletedComments: [],
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
          commentsArr.sort((a, b) => a.Entry.createdAt < b.Entry.createdAt);
          this.setState({
            comments: commentsArr,
            approvedComments: commentsArr.filter(comment => comment.Entry.deleted === false),
            deletedComments: commentsArr.filter(comment => comment.Entry.deleted === true),
            commentLoaded: true
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
  console.log(this.state);
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

  return (
    <React.Fragment>
      <div className="sub-header">
        <Container fluid={true}>
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
      <Container fluid={true} className="mt-5 comments-container">
        <Heading />
        {Object.values(approved === true ?
          this.state.approvedComments : deleted === true ?
            this.state.deletedComments : this.state.comments).map(comment =>
          <Card key={comment.Hash} className="mb-3">
            <Card.Header><div className="float-left">{comment.Entry.author} - <Moment interval={0} format="h:mm A z - MMM. D, YYYY">{comment.Entry.createdAt}</Moment></div> <div className="float-right">Replying to <a href="http://humm.earth/blog/">{comment.postTitle}</a>, posted on Humm.earth</div></Card.Header>
            <Card.Body>
              <Card.Text>
                {comment.Entry.body}
              </Card.Text>
            </Card.Body>
            <img className="caret" src={caret} />
            <div className="buttons-ft">
              {comment.Entry.deleted === false && (
                <button type="button" className="btn btn-red-dark" onClick={() => this.handleChange(comment.Hash, post.uuid)}>Delete</button>
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
