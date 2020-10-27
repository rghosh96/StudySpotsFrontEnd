import React from 'react';
import '../../styling/master.scss'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userSignUp, userSignIn, updateUserAccount, saveSpot } from '../../redux/actions/accountActions';

class TestAccountActions extends React.Component {
    constructor() {
        super();
        this.state = {
            // some examples: ChIJa00m55kayYcRnz5WcvjDiMI, ChIJnQKsxvQPyYcRxqw3vavZ3jY, ChIJp5zBHqUayYcRAwbxonj30jA
            placeId: ''
        }
    }

    render() {
        let goodSignUp = () => {
            this.props.userSignUp({
                fName: "ZMan",
                lName: "DMan",
                state: "AR",
                zipcode: 72758,
                email: "zzz@z.com",
                musicPref: 2,
                spacePref: 3,
                lightingPref: 2,
                foodPref: 2
            });
        }

        let badSignUp = () => {
            this.props.userSignUp({
                fName: "ZMan",
                lName: "DMan",
                state: "AR",
                zipcode: 72758,
                email: "email",
                musicPref: 2,
                spacePref: 3,
                lightingPref: 2,
                foodPref: 2
            });
        } 

        let goodSignIn = () => {
            this.props.userSignIn({
                email: "email",
                password: "password"
            });
        }

        let badSignIn = () => {
            this.props.userSignIn({
                email: "bad",
                password: "bad"
            });
        }

        let updateAccount = () => {
            this.props.updateUserAccount({
                fName: "DIFF fname",
                lName: "DIFF lname",
                state: "AR",
                zipcode: 99999,
                email: "diffEmail@diff.com",
                musicPref: 5,
                spacePref: 5,
                lightingPref: 5,
                foodPref: 5
            });
        }

        return (
            <div style={{position: "absolute", top: "200px"}}>
                <button onClick={goodSignUp}>good sign up</button><br/>
                <button onClick={badSignUp}>bad sign up</button><br/>
                <button onClick={goodSignIn}>good sign in</button><br/>
                <button onClick={badSignIn}>bad sign in</button><br/>
                <input type="text" placeholder="placeId" onChange={e => this.setState({placeId: e.target.value})} />
                <button onClick={() => this.props.saveSpot(this.state.placeId)}>save spot</button><br/>
                <button onClick={updateAccount}>update account</button><br/>

                <div>signingUp...{this.props.signingUp.toString()}</div>
                <div>signingIn...{this.props.signingIn.toString()}</div>
                <div>updatingAccount...{this.props.updatingAccount.toString()}</div>
                <div>savingSpot...{this.props.savingSpot}</div>
                <div>isSignedIn...{this.props.isSignedIn.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>
                <div style={{maxHeight: "1000px", maxWidth: "1200px", overflow: "auto"}}>userData...<pre>{JSON.stringify(this.props.userData, null, 2)}</pre></div>
            </div>
        )    
    } 
}

// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    signingUp: state.account.signingUp,
    signingIn: state.account.signingIn,
    savingSpot: state.account.savingSpot,
    updatingAccount: state.account.updatingAccount,
    isSignedIn: state.account.isSignedIn,
    userData: state.account.userData,
    errorMsg: state.account.errorMsg
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    userSignUp,
    userSignIn,
    updateUserAccount,
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestAccountActions.propTypes = {
    signingUp: PropTypes.bool.isRequired,
    signingIn: PropTypes.bool.isRequired,
    isSignedIn: PropTypes.bool.isRequired,
    updatingAccount: PropTypes.bool.isRequired,
    userData: PropTypes.object.isRequired,
    errorMsg: PropTypes.string.isRequired,
    userSignUp: PropTypes.func.isRequired,
    userSignIn: PropTypes.func.isRequired,
    updateUserAccount: PropTypes.func.isRequired,
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestAccountActions);