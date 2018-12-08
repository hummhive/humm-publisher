import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

class ComposeButtons extends Component {
  handleChange = e => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <React.Fragment>
        <div className="form-group button-group float-right m-0">
          <button type="button" className="btn btn-blue">PREVIEW</button>
          <button type="button" className="btn btn-red">DELETE</button>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" id="saveDraft" name="status" value="draft" onClick={this.handleChange} className="btn btn-orange mr-1" disabled={!this.props.submitEnabled}>Save as Draft</button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" id="publishPost" name="status" value="publish" onClick={this.handleChange} className="btn btn-green" disabled={!this.props.submitEnabled}>UPDATE</button>
          </OverlayTrigger>
        </div>
      </React.Fragment>
    );
  }
}
export default ComposeButtons;
