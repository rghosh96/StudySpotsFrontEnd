import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import '../../styling/master.scss';

export default function LoadSpinner() {
    return (
        <div className="load">
            <Spinner animation="grow" variant="secondary" />
            <Spinner animation="grow" variant="success" />
            <Spinner animation="grow" variant="warning" />
        </div>
    );
  }
  
  