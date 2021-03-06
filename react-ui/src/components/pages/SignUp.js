import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { userSignUp, userSignIn, updateUserAccount } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import LoadSpinner from './LoadSpinner'
import Header from '../nav/Header'


class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        fName: '',
        lName: '',
        musicPref: [],
        spacePref: [],
        lightingPref: [],
        foodPref: [],
        passwordConfirmed: false,
        modalToggle: false,
        loading: true
    }

    componentDidMount(){
        setTimeout(() => { 
          this.setState({loading: false})
        },1000)
    }

    // handles general state change info
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleConfirmPassword = (e) => {
        if (this.state.password === e.target.value) {
            this.setState({
                passwordConfirmed: true,
            })
        } else {
            this.setState({
                passwordConfirmed: false,
            })
        }
    }

    // handles submit, sending state information to redux store
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.passwordConfirmed) {
            this.props.userSignUp(this.state)
            this.setState({ loading: true })
            // wait one second to check if successfully signed in
            setTimeout(() => {
                // if not signed in, show error modal
                if (!this.props.isSignedIn) {
                    this.setState({
                        modalToggle: true
                    })
                }
                this.setState({ loading: false })
            }, 1000);
        } else {
            this.setState({
                modalToggle: true
            })
        }
        
    }

    // for handling closing of modal
    handleClose = (e) => {
        this.setState({
            modalToggle: false
        })
    }

    render() {
        // conditionally redirect to myspots if successful sign in
        if (this.state.loading) {
            return <LoadSpinner />
        } else {
        if (this.props.isSignedIn) {
        return (
            <Redirect to="/myspots" />
        )} else {
        return (
            <div>
                <Header />
                <div className = "signUpContainer">
                <Form id="form" onSubmit={this.handleSubmit}>
                    <h1>sign up</h1>
                    <p>Fields marked with (*) are required.</p>
                    <hr></hr>
                    <Form.Group >
                        <Form.Row>
                            <Col>
                                <Form.Label>First Name*</Form.Label>
                                <Form.Control required onChange={this.handleChange} id="fName" />
                            </Col>
                            <Col>
                                <Form.Label>Last Name*</Form.Label>
                                <Form.Control required onChange={this.handleChange} id="lName"  />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    
                    <Form.Group >
                        <Form.Label>Email*</Form.Label>
                        <Form.Control required onChange={this.handleChange} id="email" type="email"  />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password*</Form.Label>
                        <Form.Control required onChange={this.handleChange} id="password" type="password"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Confirm Password *</Form.Label>
                        <Form.Control required onChange={this.handleConfirmPassword} id="passwordConfirm" type="password"/>
                    </Form.Group>

                    <Button type="submit">Submit</Button>
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
                    <Modal.Body>{this.state.passwordConfirmed ? this.props.errorMsg.toString() : "Passwords do not match."}</Modal.Body>
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
SignUp.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);