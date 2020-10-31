import React from 'react';
import '../../styling/master.scss'
import { Button } from 'react-bootstrap'
import LoadSpinner from './LoadSpinner'
import Header from '../nav/Header'

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
                    <Header />
                    <div className="container">
                        <h1>spot<span className="text-secondary">light</span></h1>
                        <Button>click me!</Button>
                    </div>
                </div>
            )    
        } 
    }
}

export default Spotlight;