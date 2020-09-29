import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { userSignUp, userSignIn, updateUserAccount } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';

class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        fName: '',
        lName: '',
        zip: '',
        state: '',
        musicPref: '',
        spacePref: '',
        lightingPref: '',
        foodPref: '',
    }

    // handles general state change info
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    // handles state info that can have multiple options
    handleMOptions = (e) => {
        this.setState({
            musicPref: Array.from(e.target.selectedOptions, (item) => item.value),
        })
    }
    handleSOptions = (e) => {
        this.setState({
            spacePref: Array.from(e.target.selectedOptions, (item) => item.value),
        })
    }
    handleLOptions = (e) => {
        this.setState({
            lightingPref: Array.from(e.target.selectedOptions, (item) => item.value),
        })
    }
    handleFOptions = (e) => {
        this.setState({
            foodPref: Array.from(e.target.selectedOptions, (item) => item.value),
        })
    }

    // handles submit, sending state information to redux store
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.userSignUp(this.state)
        console.log(this.state);
    }

    render() {
        return (
            <Form onSubmit={this.handleSubmit}>
                <h1>sign up</h1>
                <hr></hr>
                <Form.Group >
                    <Form.Row>
                        <Col>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control onChange={this.handleChange} id="fName" />
                        </Col>
                        <Col>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control onChange={this.handleChange} id="lName"  />
                        </Col>
                    </Form.Row>
                </Form.Group>
                
                <Form.Group >
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={this.handleChange} id="email" type="email"  />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.handleChange} id="password" type="password"/>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>State</Form.Label>
                        <Form.Control onChange={this.handleChange} id="state"/>
                    </Form.Group>
                    
                    <Form.Group as={Col} >
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control onChange={this.handleChange} id="zip" />
                    </Form.Group>
                </Form.Row>

                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Music Preference</Form.Label>
                        <Form.Control onChange ={this.handleMOptions} as="select" multiple>
                            <option value="upbeat">upbeat</option>
                            <option value="lofi">lo fi</option>
                            <option value="indie">indie</option>
                            <option value="pop">pop</option>
                            <option value="funky">funky</option>
                            <option value="nopref">no preference</option>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group as={Col}>
                        <Form.Label>Space Preference</Form.Label>
                        <Form.Control onChange ={this.handleSOptions} as="select" multiple>
                            <option value="individual">individual study</option>
                            <option value="couple">couple of people</option>
                            <option value="smallgroup">small group (3 or less)</option>
                            <option value="largegroup">large group (4 or more)</option>
                            <option value="nopref">no preference</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Lighting Preference</Form.Label>
                        <Form.Control onChange ={this.handleLOptions} as="select" multiple>
                            <option value="dim">dim</option>
                            <option value="natural">natural</option>
                            <option value="nopref">no preference</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group as={Col}>
                        <Form.Label>Food Preference</Form.Label>
                        <Form.Control onChange ={this.handleFOptions} as="select" multiple>
                            <option value="smallbites">small bites</option>
                            <option value="bakery">bakery</option>
                            <option value="fullmenu">full menu</option>
                            <option value="coffeeonly">just coffee</option>
                            <option value="nopref">no preference</option>
                        </Form.Control>
                    </Form.Group>
                </Form.Row>

                <Button type="submit">Submit</Button>

                {/* <div>signingUp...{this.props.signingUp.toString()}</div>
                <div>signingIn...{this.props.signingIn.toString()}</div>
                <div>updatingAccount...{this.props.updatingAccount.toString()}</div>
                <div>isSignedIn...{this.props.isSignedIn.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>
                <div>userData...{JSON.stringify(this.props.userData)}</div>  */}
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