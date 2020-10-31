import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { userSignOut, fetchUserData, userSignIn } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';
import Header from '../nav/Header'

class TestSignOut extends React.Component {
    state = {
        email: '',
        password: '',
    }


      // handles submit, sending state information to redux store
      handleSignIn = (e) => {
        e.preventDefault();
        this.props.userSignIn(this.state)
    }

    handleChange = (e) => {
        this.setState( {
            [e.target.id]: e.target.value,

        })
    }

      // handles submit, sending state information to redux store
      handleSubmit = (e) => {
        e.preventDefault();
        this.props.userSignOut(this.state)
    }

    componentDidMount = () => {
        
        this.props.fetchUserData()
    }

    render() {
        
        return (
           <div>  
               <Header />
                <Form onSubmit={this.handleSignIn}>
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
                <Form onSubmit={this.handleSubmit}>

                <h1>sign in</h1>
                <hr></hr>
                
                
                

                


                <h1>sign out</h1>
                <hr></hr>
                <div>userData...{JSON.stringify(this.props.userData)}</div>
                <Button type="submit">Sign Out</Button>
                
            </Form>
            </div>
           
        )    
    } 
}
// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    signingUp: state.account.signingUp,
    signingOut: state.account.signingOut,
    signingIn: state.account.signingIn,
    updatingAccount: state.account.updatingAccount,
    isSignedIn: state.account.isSignedIn,
    userData: state.account.userData,
    errorMsg: state.account.errorMsg
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    userSignOut,
    fetchUserData,
    userSignIn
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSignOut.propTypes = {
    signingOut: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
    userSignOut: PropTypes.func.isRequired,
    fetchUserData: PropTypes.func.isRequired,
    userSignIn: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(TestSignOut);