import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import '../../styling/master.scss'

class SignUp extends React.Component {
    state = {
        email: '',
        password: '',
        fName: '',
        lName: '',
        zip: '',
        state: '',
    }

    handleChange = (e) => {
        this.setState( {
            [e.target.id]: e.target.value,

        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
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
                
                <Form.Group  controlId="formGridEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onChange={this.handleChange} id="email" type="email"  />
                </Form.Group>

                <Form.Group controlId="formGridPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control onChange={this.handleChange} id="password" type="password"/>
                </Form.Group>

                <Form.Row>
                    <Form.Group as={Col} controlId="formGridState">
                        <Form.Label>State</Form.Label>
                        <Form.Control onChange={this.handleChange} id="state"/>
                    </Form.Group>
                    
                    <Form.Group as={Col} >
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control onChange={this.handleChange} id="zip" />
                    </Form.Group>
                </Form.Row>

                <Button type="submit">Submit</Button>
            </Form>
        )    
    } 
}

export default SignUp;