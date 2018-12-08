import React, {Component} from 'react';
import {connect} from 'react-redux';
import {WithContext as ReactTags} from 'react-tag-input';
import {Form, Alert, Row, OverlayTrigger, Tooltip, Container, Col} from 'react-bootstrap';
import PropTypes from 'prop-types';
import {newPostDispatch, editPostDispatch} from '../actions';
import {Redirect} from 'react-router-dom';
import ComposeButtons from './ComposeButtons';
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
                <ComposeButtons submitEnabled={submitEnabled} postStatus={post !== null && post.status} />
              </Col>
            </Row>
          </Container>
        </div>
        <div id="content" className="mt-5">
          <Container>
            <Form id="submit-content" onSubmit={typeof match.params.id !== 'undefined' && match.params.id === post.hash ? this.handleUpdateSubmit : this.handleSubmit}>
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
  if (typeof OwnProps.match.params.id !== 'undefined') {
    const id = Object.keys(posts).filter(index => posts[index].hash === OwnProps.match.params.id);
    const post = posts[id];
    return {agent, post: post ? posts[id] : null};
  }

  return {agent, post: null};
}

export default connect(mapStateToProps)(Compose);
