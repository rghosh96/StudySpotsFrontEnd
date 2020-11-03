import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { userSignUp, userSignIn, updateUserAccount } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import Header from '../nav/Header'

class SignIn extends React.Component {
    state = {
        email: '',
        password: ''
    }

    // handles general state change info
    handleChange = (e) => {
        this.setState( {
            [e.target.id]: e.target.value,

        })
    }

      // handles submit, sending state information to redux store
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.userSignIn(this.state)
        // wait one second to check if successfully signed in
        setTimeout(() => {
            // if not signed in, show error modal
            if (!this.props.isSignedIn) {
                this.setState({
                    modalToggle: true
                    //password: ''
                });
                // check for password error message to reset password field
                 if (this.props.errorMsg.toString()=="The password is invalid or the user does not have a password.") {
                   document.getElementById("password").value = '';
                 }
                 // else reset both fields
                 else {
                    document.getElementById("password").value = '';
                    document.getElementById("email").value = '';
                }

            } 
          }, 1000);
        
    }

    // for handling closing of modal
    handleClose = (e) => {
        this.setState({
            modalToggle: false
        })
    }


    render() {
       
        // conditionally redirect to myspots if successful sign in
        if (this.props.isSignedIn) {
        return (
            <Redirect to="/myspots" />
        )} else {
        return (
            <div>
                <Header />
                <div className="container">
                    <Form onSubmit={this.handleSubmit}>
                        <h1>sign in</h1>
                        <hr></hr>
                        
                        <Form.Group  controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control required onChange={this.handleChange} id="email" type="email"  />
                        </Form.Group>

                        <Form.Group controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control required onChange={this.handleChange} id="password" type="password"/>
                        </Form.Group>

                        <Button type="submit">Sign In</Button>
                    </Form>

                    {/* error modal */}
                    <Modal 
                    show={this.state.modalToggle} 
                    onHide={this.handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title>Sorry, there was an error.</Modal.Title>
                    </Modal.Header>
                    {/* displays appropriate error message */}
                    <Modal.Body>{this.props.errorMsg.toString()}</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )  
        }  
    } 
}
// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    signingUp: state.account.signingUp,
    signingIn: state.account.signingIn,
    updatingAccount: state.account.updatingAccount,
    isSignedIn: state.account.isSignedIn,
    userData: state.account.userData,
    errorMsg: state.account.errorMsg
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    userSignUp,
    userSignIn,
    updateUserAccount
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
SignIn.propTypes = {
    signingUp: PropTypes.bool.isRequired,
    signingIn: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    updatingAccount: PropTypes.bool.isRequired,
    userData: PropTypes.object.isRequired,
    errorMsg: PropTypes.string.isRequired,
    userSignUp: PropTypes.func.isRequired,
    userSignIn: PropTypes.func.isRequired,
    updateUserAccount: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);