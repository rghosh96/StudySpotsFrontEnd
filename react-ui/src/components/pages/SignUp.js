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


class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        fName: '',
        lName: '',
        zipcode: '',
        state: '',
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
        console.log("IN CONFIRM PASSWORD")
        console.log(e.target.value)
        console.log(this.state.passwordConfirmed)
    }

    // handles state info that can have multiple options
    handleMOptions = (e) => {
        let mPref = this.state.musicPref
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            mPref.push(e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            let index = mPref.indexOf(e.target.value)
            mPref.splice(index, 1)
        }
        // update the state with the new array of options
        this.setState({ musicPref: mPref })
    }
    handleSOptions = (e) => {
        let sPref = this.state.spacePref
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            sPref.push(e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            let index = sPref.indexOf(e.target.value)
            sPref.splice(index, 1)
        }
        // update the state with the new array of options
        this.setState({ spacePref: sPref })
    }
    handleLOptions = (e) => {
        let lPref = this.state.lightingPref
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            lPref.push(e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            let index = lPref.indexOf(e.target.value)
            lPref.splice(index, 1)
        }
        // update the state with the new array of options
        this.setState({ lightingPref: lPref })
    }
    handleFOptions = (e) => {
        let fPref = this.state.foodPref
        // check if the check box is checked or unchecked
        if (e.target.checked) {
            // add the numerical value of the checkbox to options array
            fPref.push(e.target.value)
        } else {
            // or remove the value from the unchecked checkbox from the array
            let index = fPref.indexOf(e.target.value)
            fPref.splice(index, 1)
        }
        // update the state with the new array of options
        this.setState({ foodPref: fPref })
    }

    // handles submit, sending state information to redux store
    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.passwordConfirmed) {
            if (this.state.musicPref.length === 0) this.state.musicPref = "No preference."
            if (this.state.foodPref.length === 0) this.state.foodPref = "No preference."
            if (this.state.spacePref.length === 0) this.state.spacePref = "No preference."
            if (this.state.lightingPref.length === 0) this.state.lightingPref = "No preference."
            console.log(this.state)
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
        console.log(this.state.musicPref)
        console.log(this.state.spacePref)
        console.log(this.state.lightingPref)
        console.log(this.state.foodPref)
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

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>State*</Form.Label>
                            <Form.Control required onChange={this.handleChange} id="state"/>
                        </Form.Group>
                        
                        <Form.Group as={Col} >
                            <Form.Label>Zip Code*</Form.Label>
                            <Form.Control required onChange={this.handleChange} id="zipcode" />
                        </Form.Group>
                    </Form.Row>

                    <p>Select preferences from the areas below. If you do not have a preference for an area, do not check any boxes.</p>

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Music Preference</Form.Label>
                            <Form.Check type="checkbox" label="Upbeat" value="upbeat" onChange={this.handleMOptions}/>
                            <Form.Check type="checkbox" label="Lo-Fi" value="lofi" onChange={this.handleMOptions}/>
                            <Form.Check type="checkbox" label="Indie" value="indie" onChange={this.handleMOptions}/>
                            <Form.Check type="checkbox" label="Pop" value="pop" onChange={this.handleMOptions}/>
                            <Form.Check type="checkbox" label="Funky" value="funky" onChange={this.handleMOptions}/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Space Preference</Form.Label>
                            <Form.Check type="checkbox" label="Individual Study" value="individual" onChange={this.handleSOptions}/>
                            <Form.Check type="checkbox" label="Couple of People" value="couple" onChange={this.handleSOptions}/>
                            <Form.Check type="checkbox" label="Small Group (<4)" value="smallgroup" onChange={this.handleSOptions}/>
                            <Form.Check type="checkbox" label="Large Group (5+)" value="largegroup" onChange={this.handleSOptions}/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Lighting Preference</Form.Label>
                            <Form.Check type="checkbox" label="Dim Lighting" value="dim" onChange={this.handleLOptions}/>
                            <Form.Check type="checkbox" label="Natural Lighting" value="natural" onChange={this.handleLOptions}/>
                            <Form.Check type="checkbox" label="Bright Lighting" value="bright" onChange={this.handleLOptions}/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Food Preference</Form.Label>
                            <Form.Check type="checkbox" label="Small Bites/Bakery" value="smallbites" onChange={this.handleFOptions}/>
                            <Form.Check type="checkbox" label="Full Menu" value="fullmenu" onChange={this.handleFOptions}/>
                            <Form.Check type="checkbox" label="Just Coffee" value="coffee" onChange={this.handleFOptions}/>
                        </Form.Group>
                    </Form.Row>

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