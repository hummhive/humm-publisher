import React, {Component} from 'react';
import {connect} from 'react-redux';
import {WithContext as ReactTags} from 'react-tag-input';
import {Form, Alert, Row, Container, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {newPostDispatch, editPostDispatch, deletePostDispatch} from '../actions';
import {Redirect, withRouter} from 'react-router-dom';
import ComposeButtons from './ComposeButtons';
import CKEditor from '@ckeditor/ckeditor5-react';
import InlineEditor from '@ckeditor/ckeditor5-build-inline';

class Compose extends Component {
  state = {
    title: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.title : '',
    tags: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.tags.map(tag => ({id: tag, text: tag})) : [],
    content: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.content : '',
    status: this.props.post !== null && this.props.post.hash === this.props.match.params.id ? this.props.post.status : '',
    redirectCreate: false,
    redirectUpdate: false
  }

  handleSubmit = e => {
    e.preventDefault();
    const {dispatch, agent} = this.props;
    dispatch(newPostDispatch(
      this.state.title,
      agent.name,
      new Date(),
      new Date(),
      this.state.tags.map(tag => tag.text),
      this.state.content,
      e.target.id)).then(() => {
      this.setState(() => ({
        redirectCreate: true
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
      this.state.tags.map(tag => tag.text),
      this.state.content,
      e.target.id)).then(() => {
      this.setState(() => ({
        redirectUpdate: true
      }));
    });
  }

  deletePost = () => {
    const {dispatch, post} = this.props;
    if (post !== null) {
      const path = '/';
      dispatch(deletePostDispatch(post.hash, post.status)).then(() =>
        this.props.history.push({pathname: path, state: {referrer: 'deleted', postName: post.title}})
      );
    }
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

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({tags: newTags});
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

  render() {
    const {post, match, history, agent} = this.props;
    const {content, title} = this.state;
    const submitEnabled = content.length > 0 && title.length > 0;

    if (this.state.redirectCreate === true) {
      return <Redirect push to={{pathname: `/compose/${post.hash}`, state: {referrer: 'created'}}} />;
    } else if (this.state.redirectUpdate === true) {
      return <Redirect push to={{pathname: `/compose/${post.hash}`, state: {referrer: 'updated'}}} />;
    }

    if (post === null && typeof match.params.id !== 'undefined') {
      return <p>This hash does not exist...</p>;
    }

    const PostAlert = () => {
      if (typeof history.location.state !== 'undefined' && history.location.state.referrer === 'created') {
        return <Alert variant='success'>The post has been created {post.status === 'publish' ? 'and published to the blog' : 'and stored as a draft'}</Alert>;
      } else if (typeof history.location.state !== 'undefined' && history.location.state.referrer === 'updated') {
        return <Alert variant='primary'>The post has been updated {post.status === 'publish' ? 'and re-published to the blog' : 'and stored as a draft'}</Alert>;
      }
      return null;
    };

    return (
      <React.Fragment>
        <div className="sub-header">
          <Container>
            <Row>
              <Col>
                <span className="nav-sub-header">{agent.name}&#39;s Playspace &gt; <a href="http://humm.earth/blog">Humm.earth</a></span>
              </Col>
              <Col>
                <ComposeButtons submitEnabled={submitEnabled}
                  handleSubmit={this.handleSubmit}
                  handleUpdateSubmit={this.handleUpdateSubmit}
                  deletePost={this.deletePost} post={post !== null && post} status={this.state.status} />
              </Col>
            </Row>
          </Container>
        </div>
        <div id="content" className="mt-5">
          <Container>
            <PostAlert />
            <Form id="submit-content" onSubmit={typeof match.params.id !== 'undefined' && match.params.id === post.hash ? this.handleUpdateSubmit : this.handleSubmit}>
              <div className="form-group m-0">
                <input id="title" name="title" value={this.state.title} className="form-control form-control-lg" type="text" size="50" onChange={this.handleChange} placeholder="Title Goes Here" />
              </div>
              <div className="form-group ml-3 mt-1 mb-2">
                <ReactTags
                  tags={this.state.tags}
                  handleDelete={this.handleDelete.bind(this)}
                  handleAddition={this.handleAddition.bind(this)}
                  handleDrag={this.handleDrag.bind(this)}
                  placeholder="Create Topic"
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
  if (typeof OwnProps.match.params.id !== 'undefined') {
    const id = Object.keys(posts).filter(index => posts[index].hash === OwnProps.match.params.id);
    if (id.length === 0) {
      const postsObj = Object.values(posts).sort((a, b) => new Date(b.lastupdate) - new Date(a.lastupdate));
      return {agent, post: postsObj[0]};
    }
    const post = posts[id];
    return {agent, post: post ? posts[id] : null};
  }

  if (posts.length > 0) {
    const postsObj = Object.values(posts).sort((a, b) => new Date(b.lastupdate) - new Date(a.lastupdate));
    return {agent, post: postsObj[0]};
  }

  return {agent, post: null};
}

export default withRouter(connect(mapStateToProps)(Compose));
