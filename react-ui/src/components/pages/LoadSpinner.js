import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadSpinner() {
    return (
        <div className="container">
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="warning" />
        </div>
    );
  }
  
  