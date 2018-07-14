import React from "react";
import { default as SignupForm } from "./SignupForm";
import { Modal, Button } from "react-bootstrap";

export default class SignupPage extends React.Component {

  state = {
    showModal: true
  };

  handleClose = () => {
    this.setState({ showModal: false });
  }

  handleShow = () => {
    this.setState({ showModal: true });
  }

	render() {
		return (
			<div className="static-modal">
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header>
            <Modal.Title>Join our community!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <SignupForm />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary">Sign Up</Button>
          </Modal.Footer>
        </Modal>
      </div>
		);
	}
}