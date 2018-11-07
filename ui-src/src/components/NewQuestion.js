import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Card, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { newQuestionHandler } from '../actions'
import { Redirect } from 'react-router-dom'

class NewQuestion extends Component {

  state = {
    title: "",
    content: "",
    redirect: false
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch } = this.props
    dispatch(newQuestionHandler(this.state.title, this.state.content))
    this.setState(() => ({
      title: "",
      content: "",
      redirect: true
    }))
  }

  handleChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    if (this.state.redirect === true) {
      return <Redirect to='/' />
    }

    const { content, title } = this.state;
    const submitEnabled = content.length > 0 && title.length > 0;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Card>
          <Card.Body>
            <Card.Title>Create New Question</Card.Title>
              <Form.Group className="mt-3" controlId="title">
                <Form.Control type="text" placeholder="Enter the title for the question" onChange={this.handleChange} name="title" />
              </Form.Group>
            <Form.Group className="mt-3" controlId="content">
              <Form.Control as="textarea" rows="3" placeholder="Enter the text for your question" onChange={this.handleChange} name="content" />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={!submitEnabled}> Add Question</Button>
          </Card.Body>
        </Card>
      </Form>
    )
  }
}

NewQuestion.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps ({ authedUser }) {
  return {
    authedUser
  }
}

export default connect(mapStateToProps)(NewQuestion)
