import React, {Component} from 'react';
import {connect} from 'react-redux';
import {WithContext as ReactTags} from 'react-tag-input';
import {Form, Alert, Row, OverlayTrigger, Tooltip, Container, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {newPostDispatch, editPostDispatch} from '../actions';
import {Redirect} from 'react-router-dom';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

class Compose extends Component {
  state = {
    title: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.title : '',
    tags: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.tags.map(tag => ({id: tag, text: tag})) : [],
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
      this.state.tags.split(','),
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

  // need to replace with better approach since this is deprecated.
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.post !== null && nextProps.post.hash === nextProps.match.params.id) {
      this.state = {
        title: nextProps.post.title,
        tags: nextProps.post.tags.map(tag => ({id: tag, text: tag})),
        content: nextProps.post.content,
        status: nextProps.post.status
      };
    } else {
      this.state = {
        title: '',
        tags: [],
        content: '',
        status: ''
      };
    }
  }

  handleDelete(i) {
    const {tags} = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i)
    });
  }

  handleAddition(tag) {
    this.setState(state => ({tags: [...state.tags, tag]}));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({tags: newTags});
  }


  render() {
    const {post, match, history, agent} = this.props;
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
        <div className="sub-header">
          <Container>
            <Row>
              <Col>
                <span className="nav-sub-header">{agent.name}'s Playspace > <a href="humm.earth/blog">Humm.earth</a></span>
              </Col>
              <Col>
                {typeof match.params.id !== 'undefined' && match.params.id === post.hash ? (
                  <div className="form-group button-group float-right m-0">
                    <button type="button" className="btn btn-blue">PREVIEW</button>
                    <button type="button" className="btn btn-red">DELETE</button>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
                      <button type="submit" id="saveDraft" name="status" value="draft" onClick={this.handleChange} className="btn btn-orange mr-1" disabled={!submitEnabled}>Save as Draft</button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
                      <button type="submit" id="publishPost" name="status" value="publish" onClick={this.handleChange} className="btn btn-green" disabled={!submitEnabled}>UPDATE</button>
                    </OverlayTrigger>
                  </div>
                ) : (
                  <div className="form-group button-group float-right m-0">
                    <button type="submit" id="saveDraft" name="status" value="draft" onClick={this.handleChange} className="btn btn-orange" disabled={!submitEnabled}>Save as Draft</button>
                    <button type="submit" id="publishPost" name="status" value="publish" onClick={this.handleChange} className="btn btn-green" disabled={!submitEnabled}>Publish</button>
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
        <div id="content" className="mt-5">
          <Container>
            <Form onSubmit={typeof match.params.id !== 'undefined' && match.params.id === post.hash ? this.handleUpdateSubmit : this.handleSubmit}>
              <div className="form-group m-0">
                <input id="title" name="title" value={this.state.title} className="form-control form-control-lg" type="text" size="50" onChange={this.handleChange} placeholder="Title Goes Here" />
              </div>
              <div className="form-group ml-3 mt-1">
                <ReactTags
                  tags={this.state.tags}
                  handleDelete={this.handleDelete.bind(this)}
                  handleAddition={this.handleAddition.bind(this)}
                  placeholder="Create Topic"
                  handleDrag={this.handleDrag.bind(this)}
                />
              </div>
              <div className="form-group">
                <CKEditor
                  editor={ InlineEditor }
                  data={this.state.content}
                  onChange={ (event, editor) => {
                    const data = editor.getData();
                    this.handleContentChange(data);
                  } }
                />
              </div>
            </Form>
          </Container>
        </div>
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
