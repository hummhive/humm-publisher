import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Tab, Tabs, Container, Row, Col} from 'react-bootstrap';
import PostList from './PostList';

class Manage extends Component {
  state = {
    key: 'All Stories'
  }

  render () {
    const {stories_count, drafts_count, published_count} = this.props;
    return (
      <React.Fragment>
        <Container className="mt-5">
          <Row>
            <Col>
              <h1>{this.state.key}</h1>
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

function mapStateToProps({posts}) {
  const postsObj = Object.values(posts).sort((a, b) => a.lastupdate < b.lastupdate);
  return {post: postsObj ? postsObj : null,
    stories_count: postsObj.length,
    drafts_count: Object.keys(postsObj).filter(post => posts.status === 'draft').length,
    published_count: Object.keys(postsObj).filter(post => posts.status === 'publish').length
  };
}

export default connect(mapStateToProps)(Manage);
