import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'
import { Button } from 'react-bootstrap'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'react-bootstrap';
import { fetchSavedSpotsDetails, fetchSpotDetails, fetchSpotsConstants } from '../../redux/actions/spotsActions';
import { removeSavedSpot } from '../../redux/actions/accountActions';

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
        const fetchSavedSpotsDetails = () => {
            this.props.fetchSavedSpotsDetails({
                //placeId = this.state.placeId,
            });
        };

        if (this.state.loading) {
            return <LoadSpinner/>
        } else {
            return (
                <div>
                    <Header />
                    <h1>my spots</h1>
                    {this.props.spots ? this.props.spots.map(spot => {

                        return (
                            <div className="spotlight">

                                <span >
                                    <img className="image" src={spot.photos[0].url ? spot.photos[0].url : "NA"} />
                                </span>

                                <span>
                                    <div>
                                        <span className="title" >
                                            {spot.name}
                                        </span>

                                        <span className="open">
                                            {spot.openNow ? "Open" : "Closed"}
                                        </span>
                                    </div>
                                    <div className="gray">
                                        {spot.distance} miles away
                                    </div>

                                    <div className="gray">
                                        {spot.types[0]}
                                    </div>
                                </span>

                                <span>
                                    <Button onClick={removeSavedSpot}>Remove</Button>
                                </span>
                            </div>
                        )
                    }) : null}

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
    fetchSavedSpotsDetails,
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