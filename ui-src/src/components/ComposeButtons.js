import React, {Component} from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

class ComposeButtons extends Component {
  render() {
    const Buttons = () => {
      if (this.props.postStatus === 'publish') {
        return <div className="form-group button-group float-right m-0">
          <button type="button" className="btn btn-blue">PREVIEW</button>
          <button type="button" onClick={this.props.deletePost} className="btn btn-red">DELETE</button>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" name="status" id="draft" onClick={this.props.handleUpdateSubmit} className="btn btn-orange mr-1" disabled={!this.props.submitEnabled}>MARK AS DRAFT</button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" name="status" id="publish" onClick={this.props.handleUpdateSubmit} className="btn btn-green" disabled={!this.props.submitEnabled}>UPDATE</button>
          </OverlayTrigger>
        </div>;
      } else if (this.props.postStatus === 'draft') {
        return <div className="form-group button-group float-right m-0">
          <button type="button" className="btn btn-blue">PREVIEW</button>
          <button type="button" onClick={this.props.deletePost} className="btn btn-red">DELETE</button>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" name="status" id="draft" onClick={this.props.handleUpdateSubmit} className="btn btn-orange mr-1" disabled={!this.props.submitEnabled}>UPDATE DRAFT</button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">WARNING: The Hash of the post will be replaced!!</Tooltip>}>
            <button type="submit" form="submit-content" name="status" id="publish" onClick={this.props.handleUpdateSubmit} className="btn btn-green" disabled={!this.props.submitEnabled}>PUBLISH</button>
          </OverlayTrigger>
        </div>;
      }
      return <div className="form-group button-group float-right m-0">
        <button type="submit" form="submit-content" name="status" id="draft" onClick={this.props.handleSubmit} className="btn btn-orange mr-1" disabled={!this.props.submitEnabled}>SAVE DRAFT</button>
        <button type="submit" form="submit-content" name="status" id="publish" onClick={this.props.handleSubmit} className="btn btn-green" disabled={!this.props.submitEnabled}>PUBLISH</button>
      </div>;
    };
    return (
      <Buttons />
    );
  }
}
export default ComposeButtons;
