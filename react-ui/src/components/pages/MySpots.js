import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'react-bootstrap';
import { fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants } from '../../redux/actions/spotsActions';
import Header from '../nav/Header'

class MySpots extends React.Component {
    state = {
        loading: true
    }

    constructor() {
        super()
        this.state = {
            l: '',
            pl: '',
            rb: '',
            t: '',
            k: '',
            placeId: '',
        }
    }


    handleChange = (e) => {
        this.setState( {
        [e.target.id]: e.target.value,
        })
        

    }

    // "loading"
    componentDidMount(){
        this.props.fetchSpotsConstants();
        setTimeout(() => { 
          this.setState({loading: false})
        },1000)
    }
    render() {
        const fetchNearbySpots = () => {
            this.props.fetchNearbySpots({
                language: this.state.l,
                priceLevel: this.state.pl,
                rankBy: this.state.rb,
                type: this.state.t,
                keyword: this.state.k
            });
        };

        

        if (this.state.loading) {
            return <LoadSpinner/>
        } else {
            return (
                <div>
                    <Header />

                    <h1>myspots</h1>
                   
                </div>
            )    
        } 
    }
}


    



const mapStateToProps = state => ({
    fetchingSpots: state.spots.fetchingSpots,
    spotsFetched: state.spots.spotsFetched,
    spots: state.spots.spots,
    activeSpot: state.spots.activeSpot,
    errorMsg: state.spots.errorMsg,
    businessStatusConstants: state.spots.businessStatusConstants,
    languageConstants: state.spots.languageConstants,
    priceLevelConstants: state.spots.priceLevelConstants,
    rankByConstants: state.spots.rankByConstants,
    typeConstants: state.spots.typeConstants,
});




const mapDispatchToProps = {
    fetchNearbySpots,
    fetchSpotsConstants,
    fetchSpotDetails
}

MySpots.propTypes = {
    fetchingSpots: PropTypes.bool.isRequired,
    spotsFetched: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    errorMsg: PropTypes.string.isRequired,
    businessStatusConstants: PropTypes.array.isRequired,
    languageConstants: PropTypes.array.isRequired,
    priceLevelConstants: PropTypes.array.isRequired,
    rankByConstants: PropTypes.array.isRequired,
    typeConstants: PropTypes.array.isRequired,
    fetchNearbySpots: PropTypes.func.isRequired,
    fetchSpotDetails: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(MySpots);