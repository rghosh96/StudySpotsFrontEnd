import React, { Component } from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../../styling/master.scss'

export default class Header extends Component {

    render() {
        return (
            <div className="header">
                <Navbar bg="light" expand="lg">
                    <Navbar.Brand as={Link} to="/">Study Spots</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link as={Link} to="/">Spotlight</Nav.Link>
                            <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
                            <Nav.Link as={Link} to="/myspots">My Spots</Nav.Link>
                            <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                            <NavDropdown title="Redux" id="basic-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/redux/testaccountactions">Account</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/redux/testspotsactions">Spots</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/redux/testsignout">Sign Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                            <Navbar.Collapse className="justify-content-end">
                                <Nav.Link as={Link} to="/signin">Sign in</Nav.Link>
                                <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                            </Navbar.Collapse>
                </Navbar>
            </div>
        )
    }
}