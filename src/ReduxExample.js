// This example shows how redux should be integrated with React components.
//
// In general, only class components should talk to redux actions and global store.
// when you need to use store data in a functional component, get it in a class 
// component and pass it as props to the functional one it renders.
//
// NEVER try to change a global store property inside a component. This defeats the
// entire point of actions, and it won't work with the redux framework. From the component 
// scope, global store properties are readonly!!!

import React, { Component } from 'react';
// importing these to enable redux functionality
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// importing the redux actions used in this component
import { updateSubmittedText, incrementButtonValue } from './redux/actions/exampleActions';

class ReduxExample extends Component {
    constructor() {
        super();

        this.state = {
            textboxValue: ''
        };
    };

    render() {
        return (
            <div>
                Type something in the box:
                <br />
                {/* standard way of implementing HTML form elements in React with state */}
                <input value={this.state.textboxValue} onChange={(event) => this.handleTextChange(event)} type="text" />
                <button onClick={() => this.submitText()}>Submit</button>
                <br />
                Value of textbox in component state......{this.state.textboxValue}
                <br />
                {/* the store value is retreived using this.props */}
                Value of submitted text in redux store...{this.props.submittedText}

                <br />
                <br />

                {/* render a button showing the current value of some data (buttonValue) from the redux store */}
                Click to increment:
                <br />
                <button onClick={() => this.clickIncrement()}>Redux store value...{this.props.buttonValue}</button>

                <br />
                <br />

                {/* this variable isn't directly affected by the actions we imported, we are just reading its value from the store */}
                {this.props.isSameValue ?
                    "The submitted text and button value are the same!"
                    : "The submitted text and button value are different."}

            </div>
        );
    };

    // this callback function only changes the state property textboxValue. it has nothing to do with redux
    handleTextChange = (event) => {
        this.setState({ textboxValue: event.target.value });
    };

    // called when the submit button is clicked. it sends the current textbox value (the state value)
    // to the redux action we have linked, also using this.props
    submitText = () => {
        this.props.updateSubmittedText(this.state.textboxValue);
    };

    // when the increment button is clicked, call the corresponding redux action. It is perfectly fine to 
    // use global store values as parameters for redux actions, since we typically don't want to give them
    // permission to read the global store
    clickIncrement = () => {
        this.props.incrementButtonValue(this.props.buttonValue);
    };
}

// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    submittedText: state.example.submittedText,
    buttonValue: state.example.buttonValue,
    isSameValue: state.example.isSameValue
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    updateSubmittedText,
    incrementButtonValue
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
ReduxExample.propTypes = {
    submittedText: PropTypes.string.isRequired,
    updateSubmittedText: PropTypes.func.isRequired,
    buttonValue: PropTypes.number.isRequired,
    incrementButtonValue: PropTypes.func.isRequired,
    isSameValue: PropTypes.bool.isRequired
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(ReduxExample);