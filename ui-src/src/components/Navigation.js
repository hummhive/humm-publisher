import React, { Component } from 'react'
import Navbar from 'react-bootstrap/lib/Navbar'
import { connect } from 'react-redux'
import Nav from 'react-bootstrap/lib/Nav'
import { Container, Row, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

class Navigation extends Component {

  render() {
    return (
      <Navbar>
        <Container>
          <Row>
            <LinkContainer to="/"><Navbar.Brand>Hello! Questions </Navbar.Brand></LinkContainer>
            <Nav className="mr-auto">
              <LinkContainer to="/add"><Nav.Link>New Question</Nav.Link></LinkContainer>
            </Nav>
          </Row>
        </Container>
      </Navbar>
    );
  }
}


function mapStateToProps({authedUser}){
  return {authedUser}
}

export default connect(mapStateToProps)(Navigation)
