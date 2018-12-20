import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tab, Tabs, Container, Row, Col, Alert} from 'react-bootstrap';
import PostList from './PostList';
import PropTypes from 'prop-types';

class Manage extends Component {
  state = {
    key: 'All Stories'
  }

  render () {
    const {stories_count, drafts_count, published_count, history, post} = this.props;

    if (post === null) {
      return <p>There are no posts yet, <Link to='/compose'>start by making one!</Link> 😁</p>;
    }

    const PostAlert = () => {
      if (typeof history.location.state !== 'undefined' && history.location.state.referrer === 'deleted') {
        return <Alert variant='success'>The post {history.location.state.postName} has been deleted</Alert>;
      }
      return null;
    };

    return (
      <React.Fragment>
        <Container className="mt-5">
          <Row>
            <Col>
              <PostAlert />
              <h1 className="heading-manage mt-4 mb-5 ml-4">{this.state.key}</h1>
              <Tabs className="mt-5" defaultActiveKey="profile" id="uncontrolled-tab-example" activeKey={this.state.key} onSelect={key => this.setState({key})}>
                <Tab eventKey="All Stories" title={`All - ${stories_count}`}>
                  <PostList label="All" />
                </Tab>
                <Tab eventKey="Drafts" title={`Drafts - ${drafts_count}`}>
                  <PostList status="draft" label="Drafts" />
                </Tab>
                <Tab eventKey="Published" title={`Published - ${published_count}`}>
                  <PostList status="publish" label="Published" />
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

Manage.propTypes = {
  stories_count: PropTypes.number,
  drafts_count: PropTypes.number,
  post: PropTypes.array,
  published_count: PropTypes.number,
  history: PropTypes.object
};

function mapStateToProps({posts}) {
  const postsObj = Object.values(posts).sort((a, b) => new Date(b.lastupdate) - new Date(a.lastupdate));
  return {
    post: postsObj ? postsObj : null,
    stories_count: postsObj.length,
    drafts_count: postsObj.filter(post => post.status === 'draft').length,
    published_count: postsObj.filter(post => post.status === 'publish').length
  };
}

export default connect(mapStateToProps)(Manage);
