import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { userSignUp, userSignIn, updateUserAccount } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';

class SignIn extends React.Component {
    state = {
        email: '',
        password: '',
    }

    handleChange = (e) => {
        this.setState( {
            [e.target.id]: e.target.value,

        })
    }

      // handles submit, sending state information to redux store
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.userSignIn(this.state)
        console.log(this.state);
    }
    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>sign in</h1>
                <hr></hr>
                
                <Form.Group  controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={this.handleChange} id="email" type="email"  />
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.handleChange} id="password" type="password"/>
                </Form.Group>

                <Button type="submit">Sign In</Button>
            </Form>
        )    
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