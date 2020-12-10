import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import '../../styling/master.scss'
import { connect } from 'react-redux';
import { updateUserAccount } from '../../redux/actions/accountActions';
import PropTypes from 'prop-types';
import {Modal} from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import LoadSpinner from './LoadSpinner'
import Header from '../nav/Header'
import { fetchUserData } from '../../redux/actions/accountActions';


class Settings extends React.Component {
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
        this.props.fetchUserData()
        setTimeout(() => { 
          this.setState({loading: false})
        },1000)
        
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.userDataFetched !== prevProps.userDataFetched) {
            this.setState({fName: this.props.userData.fName, lName: this.props.userData.lName})
        }
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
        console.log(this.state.password)
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
            console.log(this.state)
            this.props.updateUserAccount(this.state)
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
        if (this.state.loading) {
            return <LoadSpinner />
        } else {
            console.log("USER DATA:")
            console.log(this.props.userData)
        return (
            <div>
                <Header />
                <div className = "signUpContainer">
                <Form id="form" onSubmit={this.handleSubmit}>
                    <h1>settings</h1>
                    <p>Update password, preferences, and location here for {this.state.fName} {this.state.lName}</p>
                    <hr></hr>
                    <Form.Group>
                        <Form.Label>New Password</Form.Label>
                        <Form.Control onChange={this.handleChange} id="password" type="password"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control onChange={this.handleConfirmPassword} id="passwordConfirm" type="password"/>
                    </Form.Group>

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
            </div>
                
            )    
        } 
    }
}


// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    signingIn: state.account.signingIn,
    updatingAccount: state.account.updatingAccount,
    isSignedIn: state.account.isSignedIn,
    userData: state.account.userData,
    errorMsg: state.account.errorMsg,
    userData: state.account.userData,
    userDataFetched: state.account.userDataFetched
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    updateUserAccount,
    fetchUserData
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
Settings.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    updatingAccount: PropTypes.bool.isRequired,
    userData: PropTypes.object.isRequired,
    errorMsg: PropTypes.string.isRequired,
    userSignIn: PropTypes.func.isRequired,
    updateUserAccount: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);