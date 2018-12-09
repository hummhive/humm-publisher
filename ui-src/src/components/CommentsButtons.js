import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

class CommentsButtons extends Component {

  handleClick(event) {
    if (event === 'all') {
      this.setState({
        all: true,
        approved: false,
        deleted: false
      });
    } else if (event === 'approved') {
      this.setState({
        all: false,
        approved: true,
        deleted: false
      });
    } else if (event === 'deleted') {
      this.setState({
        all: false,
        approved: false,
        deleted: true
      });
    }
  }

  render() {
    console.log(this.state)
    return (
      <div className="form-group button-group float-right m-0">
        <button onClick={() => this.handleClick("all")} type="button" name="all" className="btn btn-light-green mr-1">ALL</button>
        <button onClick={() => this.handleClick("approved")} type="button" name="approved" className="btn btn-dark">APPROVED</button>
        <button onClick={() => this.handleClick("deleted")} type="button" name="deleted" className="btn btn-red-dark">DELETED</button>
      </div>
    );
  }
}
export default CommentsButtons;
