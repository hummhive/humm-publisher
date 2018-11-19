import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Alert, OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {newPostDispatch, editPostDispatch} from '../actions';
import {Redirect} from 'react-router-dom';
import Editor from 'react-medium-editor';
require('medium-editor/dist/css/medium-editor.css');
require('medium-editor/dist/css/themes/beagle.css');

class Compose extends Component {
  state = {
    title: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.title : '',
    tags: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.tags : '',
    content: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.content : '',
    status: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.status : '',
    redirect: false,
    toHome: false
  }

  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, agent} = this.props;
    dispatch(newPostDispatch(
      this.state.title,
      agent.name,
      new Date(),
      new Date(),
      this.state.tags.split(','),
      this.state.content,
      this.state.status)).then(() => {
      this.setState(() => ({
        redirect: true
      }));
    });
  }

  handleUpdateSubmit = e => {
    e.preventDefault();
    const {dispatch, post, agent} = this.props;
    dispatch(editPostDispatch(
      post.hash,
      post.uuid,
      this.state.title,
      agent.name,
      post.pubdate,
      new Date(),
      this.state.tags,
      this.state.content,
      this.state.status)).then(() => {
      this.setState(() => ({
        toHome: true
      }));
    });
  }

  handleChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  handleContentChange = text => {
    this.setState({
      content: text
    });
  }

  // todo: need to replace with better approach
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.post !== null && nextProps.post.hash === nextProps.match.params.id) {
      this.state = {
        title: nextProps.post.title,
        tags: nextProps.post.tags,
        content: nextProps.post.content,
        status: nextProps.post.status
      };
    } else {
      this.state = {
        title: '',
        tags: '',
        content: '',
        status: ''
      };
    }
  }

  render() {
    const {post, match, history} = this.props;
    const {content, title} = this.state;
    const submitEnabled = content.length > 0 && title.length > 0;

    if (this.state.redirect === true) {
      return <Redirect push to={{pathname: `/compose/${post.hash}`, state: {referrer: 'created'}}} />;
    } else if (this.state.toHome === true) {
      return <Redirect push to={{pathname: '/post/', state: {referrer: 'updated'}}} />;
    }

    if (post === null && typeof match.params.id !== 'undefined') {
      return <p>This hash does not exist...</p>;
    }


    return (
      <React.Fragment>
        {typeof history.location.state !== 'undefined' && history.location.state.referrer === 'created' && (
          <Alert variant='primary'>The post has been created {post.status === 'publish' ? 'and published to the blog' : 'and stored as a draft'}</Alert>
        )}
        <Form onSubmit={typeof match.params.id !== 'undefined' && match.params.id === post.hash ? this.handleUpdateSubmit : this.handleSubmit}>
          <div className="form-group">
            <input id="title" name="title" value={this.state.title} className="form-control form-control-lg" type="text" size="50" onChange={this.handleChange} placeholder="Some Sweet Title Here" />
          </div>
          <div className="form-group">
            <input id="tags" name="tags" value={this.state.tags} className="form-control form-control-lg" type="text" size="50" onChange={this.handleChange} placeholder="Write Some Tags: holochain, beta, politics, news" />
          </div>
          <div className="form-group">
            <Editor
              tag="div"
              text={this.state.content}
              onChange={this.handleContentChange}
              options={{autoLink: true, toolbar: {buttons: ['bold', 'italic', 'h1', 'h2', 'image', 'anchor', 'orderedlist', 'unorderedlist', 'justifyLeft', 'justifyCenter', 'justifyRight']}}}
            />
          </div>
          {typeof match.params.id !== 'undefined' && match.params.id === post.hash ? (
            <div className="form-group button-group">
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
                <button type="submit" id="saveDraft" name="status" value="draft" onClick={this.handleChange} className="btn btn-outline-btn-secondary mr-1" disabled={!submitEnabled}>Save as Draft</button>
              </OverlayTrigger>
              <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
                <button type="submit" id="publishPost" name="status" value="publish" onClick={this.handleChange} className="btn btn-primary" disabled={!submitEnabled}>Re-Publish</button>
              </OverlayTrigger>
            </div>
          ) : (
            <div className="form-group button-group">
              <button type="submit" id="saveDraft" name="status" value="draft" onClick={this.handleChange} className="btn btn-outline-btn-secondary mr-1" disabled={!submitEnabled}>Save as Draft</button>
              <button type="submit" id="publishPost" name="status" value="publish" onClick={this.handleChange} className="btn btn-primary" disabled={!submitEnabled}>Publish</button>
            </div>
          )}
        </Form>
      </React.Fragment>
    );
  }
}

Compose.propTypes = {
  dispatch: PropTypes.func,
  agent: PropTypes.object,
  post: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps({agent, posts}, OwnProps) {
  if (Object.keys(posts).length === 0) {
    return {agent, post: null};
  }
  if (typeof OwnProps.match.params.id !== 'undefined') {
    const id = Object.keys(posts).filter(index => posts[index].hash === OwnProps.match.params.id);
    const post = posts[id];
    return {agent, post: post ? posts[id] : null};
  }
  const postsObj = Object.values(posts).sort((a, b) => a.lastupdate < b.lastupdate);
  return {agent, post: postsObj[0]};
}

export default connect(mapStateToProps)(Compose);
