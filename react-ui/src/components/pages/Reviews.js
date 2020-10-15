import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'

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
                    <h1>reviews</h1>
                </div>
            )    
        } 
    }
}

export default Reviews;