import React, {Component} from 'react';
import {connect} from 'react-redux';
import {handleInitialData} from '../actions';
import {FaEdit, FaComments} from 'react-icons/fa';
import LoadingBar from 'react-redux-loading-bar';
import {Container, Row, Col, Badge} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Link, NavLink, Redirect} from 'react-router-dom';
import Post from './Post';
import PropTypes from 'prop-types';
import Compose from './Compose';
import Comment from './Comment';
import Sidebar from './Sidebar';

class App extends Component {
  componentDidMount () {
    this.props.dispatch(handleInitialData());
  }
  render () {
    const {loading, agent, postcount} = this.props;
    return (
      <Router>
        <React.Fragment>
          <LoadingBar />
          <Route exact path="/" render={() => (
            <Redirect to='/post' />
          )}/>
          <Container fluid={true}>
            <Row>
              <Col md={3} className="px-0 border-right" id="sticky-sidebar">
                <div className="py-0 sticky-top">
                  <header className="navbar navbar-expand flex-column flex-md-row bd-navbar mb-3 border-bottom">
                    <Link className="navbar-brand m-auto" to="/post" aria-label="Bootstrap">Humm Publisher</Link>
                  </header>
                  <ul className="nav nav-pills justify-content-center border-bottom pb-3 pt-1">
                    <li className="nav-item">
                      <NavLink className="nav-link" to='/post'>Articles <Badge variant="light">{agent !== null ? postcount : '0'}</Badge></NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to='/comment'><FaComments /></NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to='/compose'><FaEdit /></NavLink>
                    </li>
                  </ul>
                  <div id="post-list" className="list-group list-group-flush">
                    <Route path={'/:page?/:id?/'} component={Sidebar} />
                    {agent !== null &&
                        <span className="footer-author"><small><strong>Signed as: </strong>{agent.name}</small></span>
                    }
                  </div>
                </div>
              </Col>
              <div id="content" className="col-9 px-5 mt-4">
                {loading === true ? (
                  <p>Loading data from Holochain...</p>
                ) : (
                  <React.Fragment>
                    <Route path="/compose/:id?/" component={Compose} />
                    <Route path={'/post/:id?/'} component={Post} />
                    <Route path={'/comment/:id?/'} component={Comment} />
                  </React.Fragment>
                )}
              </div>
            </Row>
          </Container>
        </React.Fragment>
      </Router>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  agent: PropTypes.object,
  loading: PropTypes.bool,
  postcount: PropTypes.number
};

function mapStateToProps ({agent, posts}) {
  return {
    agent,
    loading: agent === null,
    postcount: Object.values(posts).length
  };
}

export default connect(mapStateToProps)(App);
