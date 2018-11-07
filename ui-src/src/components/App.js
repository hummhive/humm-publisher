import React, { Component } from 'react'
import { connect } from 'react-redux'
import { handleInitialData } from '../actions'
import LoadingBar from 'react-redux-loading-bar'
import { Container, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Navigation from './Navigation'
import Question from './Question'
import NewQuestion from './NewQuestion'

class App extends Component {
  componentDidMount () {
    this.props.dispatch(handleInitialData())
  }
  render () {
    return (
      <Router>
        <React.Fragment>
            <LoadingBar />
          <Container fluid className="p-0">
            <Row>
              <Col md={12}>
                <Navigation />
              </Col>
            </Row>
          </Container>
          <Container>
            <Row className="h-100 mt-5">
              <Col md={12} className="align-self-center">
                <div>
                  <Route path="/" exact component={Dashboard} />
                  <Route path="/question/:id" component={Question} />
                  <Route path="/add" component={NewQuestion} />
                </div>
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      </Router>
    )
  }
}
export default connect()(App)
