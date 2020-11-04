import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'
import Header from '../nav/Header'

class Reviews extends React.Component {
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
                        <h1>reviews</h1>
                    </div>
                </div>
            )    
        } 
    }
}

export default Reviews;