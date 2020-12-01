import React from 'react';
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userSignOut } from "../../redux/actions/accountActions";
import '../../styling/header.scss'

export default function Header() {
    const signedIn = useSelector(state => state.account.isSignedIn)

    const dispatch = useDispatch()
    const signOut = () => {
        dispatch(userSignOut())
    }

    return (
        <div className="header">
            <Navbar expand="lg">
                <Navbar.Brand as={Link} to="/">STUDY SPOTS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Spotlight</Nav.Link>
                        <Nav.Link as={Link} to="/reviews">Reviews</Nav.Link>
                        <Nav.Link as={Link} to="/myspots">My Spots</Nav.Link>
                        <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                        <Nav.Link as={Link} to="/spotpage/ChIJa00m55kayYcRnz5WcvjDiMI">Spot Page</Nav.Link>
                        <NavDropdown title="Redux" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/redux/testaccountactions">Account</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/redux/testspotsactions">Spots</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/redux/testsignout">Sign Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="justify-content-end">
                            {signedIn ? null : <Nav.Link as={Link} to="/signin">Sign in</Nav.Link> }
                            {signedIn ? null : <Nav.Link as={Link} to="/signup">Sign up</Nav.Link> }
                            {signedIn ? <Nav.Link as={Link} onClick={signOut} to="/">Sign out</Nav.Link> : null }
                        </Nav>
                </Navbar.Collapse>
                        
            </Navbar>
        </div>
    )
}