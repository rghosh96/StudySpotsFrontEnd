import React from 'react';
import '../../styling/master.scss'
import { Button } from 'react-bootstrap'
import LoadSpinner from './LoadSpinner'

class Spotlight extends React.Component {
    state = {
        loading: true
    }

    // "loading"
    componentDidMount(){
        setTimeout(() => { 
          this.setState({loading: false})
        },1000)
    }

    render() {
        if (this.state.loading) {
            return <LoadSpinner/>
        } else {
            return (
                <div>
                    <h1>my <span class="text-secondary">spots</span></h1>
                    <Button>click me!</Button>
                </div>
            )    
        } 
    }
}

export default Spotlight;