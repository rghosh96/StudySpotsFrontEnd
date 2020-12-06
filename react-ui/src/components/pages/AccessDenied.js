import React from 'react';
import { Button } from 'react-bootstrap';
import history from '../../history';
import '../../styling/master.scss';

export default function AccessDenied(props) {
    const handleClickSpot = (e) => {
        e.preventDefault();
        history.push("/signup")
        window.location.reload();
        // this.setState({ redirect: true, placeId: placeId })
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            {props.children}
            <br/>
            <div style={{width: '100%'}}><Button onClick={handleClickSpot}>Create a free account</Button></div>
        </div>
    )
}