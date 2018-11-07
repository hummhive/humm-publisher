import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect, Link } from 'react-router-dom'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'

class Question extends Component {
  render() {

    const { question } = this.props

    if (question === null) {
      return <p>This question doesn&apos;t exist</p>
    }
    return (
      <Container fluid className="p-0 dashboard">
        <Row>
          <Col md={3}>
            <div className="topics">
            <h6>TOPICS</h6>
            <p>Start exploring!</p>
            <ul>
            <li><a href="#">#Games</a></li>
            <li><a href="#">#Porn</a></li>
            </ul>
            </div>
          </Col>
          <Col md={9}>
            <div className="questions">
              <ListGroup>
                <ListGroup.Item action href="#link1">
                  <h4>{question.title}</h4>
                    <div className="sub-header">
                    <small>Asked by {question.author} on {question.pubdate}</small>
                    </div>
                  <div className="content">{question.content}</div>
                  <div className="footer-hashtag">
                    <small>#games</small>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

function mapStateToProps({questions}, ownProps){
  const index = Object.keys(questions);
  const questionId = index.filter(index => {
  return questions[index].hash === ownProps.match.params.id;
  });
  const question = questions[questionId];
  return { question : question ? question : null  };
}

export default connect(mapStateToProps)(Question)
