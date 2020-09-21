import React from 'react';
import '../../styling/master.scss'
import { Button } from 'react-bootstrap'

class Spotlight extends React.Component {
    render() {
        return (
            <div>
                <h1>spotlight</h1>
                <Button>click me!</Button>
            </div>
        )    
    } 
}

export default Spotlight;