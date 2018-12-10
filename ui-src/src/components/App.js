import React, {Component} from 'react';
import {connect} from 'react-redux';
import {handleInitialData} from '../actions';
import logo from '../images/logo.png';
import settings from '../images/settings.png';
import avatar from '../images/no-avatar.png';
import LoadingBar from 'react-redux-loading-bar';
import {Container, Row, Col} from 'react-bootstrap';
import {BrowserRouter as Router, Route, Link, Switch} from 'react-router-dom';
import Manage from './Manage';
import PropTypes from 'prop-types';
import Compose from './Compose';
import Comment from './Comment';

class App extends Component {
  componentDidMount () {
    this.props.dispatch(handleInitialData());
  }
  render () {
    const {loading} = this.props;
    return (
      <Router>
        <React.Fragment>
          <LoadingBar />
          <header>
            <Container fluid={true}>
              <Row>
                <Col xs={2}>
                  <Link to="/"><img className="logo" src={logo} width="113" height="36" /></Link>
                </Col>
                <Col xs={7}>
                  <ul className="nav-buttons">
                  <li><Link to="/compose"><button type="button" className="btn btn-header-orange">NEW STORY</button></Link></li>
                    <li><Link to="/"><button type="button" className="btn btn-header-normal">MANAGE</button></Link></li>
                    <li><Link to="/comment"><button type="button" className="btn btn-header-normal">COMMENTS</button></Link></li>                  </ul>
                </Col>
                <Col>
                  <div className="float-right">
                    <ul className="nav-right">
                      <li><img className="avatar rounded" src={avatar} width="37" height="37" /></li>
                      <li><img className="setting-icon" src={settings} width="37" height="37" /></li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </header>
          {loading === true ? (
            <div className="loading-container mt-5 text-center"><p>Loading data from Holochain...</p></div>
          ) : (
            <Switch>
              <Route exact path='/' component={Manage} />
              <Route path={'/compose/:id?/'} component={Compose} />
              <Route path={'/comment/:id?/'} component={Comment} />
            </Switch>
          )}
        </React.Fragment>
      </Router>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  agent: PropTypes.object,
  loading: PropTypes.bool
};

function mapStateToProps ({agent}) {
  return {
    agent,
    loading: agent === null
  };
}

export default connect(mapStateToProps)(App);
