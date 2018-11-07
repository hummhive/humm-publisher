import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Container, Row, Col, ListGroup } from 'react-bootstrap'
import { Redirect, Link } from 'react-router-dom'

class Dashboard extends Component {
  render () {
    const { questionsObj } = this.props

    if (questionsObj === null) {
      return <p>There are no questions yet, <Link to='/add'>start by making one!</Link></p>
    }

    return (
      <Container fluid className="p-0 dashboard">
        <Row>
          <Col md={3}>
            <div className="topics">
            <h6>TOPICS</h6>
            <p>Start exploring!</p>
            <ul>
            <li><Link to='/'>#Games</Link></li>
            <li><Link to='/'>#Porn</Link></li>
            </ul>
            </div>
          </Col>
          <Col md={9}>
            <div className="questions">
              <ListGroup>
                {questionsObj.map(question => (
                <ListGroup.Item key={question.id}>
                  <Link to={`/question/${question.id}`}>
                  <h4>{question.title}</h4>
                    <div className="sub-header">
                    <small>Asked by {question.author} on {question.pubdate}</small>
                    </div>
                  <div className="content">{question.content}</div>
                  <div className="footer-hashtag">
                    <small>#games</small>
                  </div>
                  </Link>
                </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

function mapStateToProps({questions}){
  const index = Object.keys(questions);
  const questionsObj = index.map(index => ({
    id: questions[index].hash,
    title: questions[index].title,
    pubdate: questions[index].pubdate,
    author: questions[index].author,
    content: questions[index].content
  }));
  return { questionsObj };
}

export default connect(mapStateToProps)(Dashboard)
