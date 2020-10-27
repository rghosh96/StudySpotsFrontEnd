import React from 'react';
import '../../styling/master.scss'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchNearbySpots, fetchSpotsConstants } from '../../redux/actions/spotsActions';

class TestSpotsActions extends React.Component {
    constructor() {
        super()
        this.state = {
            l: '',
            pl: '',
            rb: '',
            t: '',
            k: ''
        }
    }

    componentDidMount() {
        this.props.fetchSpotsConstants();
    }

    render() {
        let fetchNearbySpots = () => {
            this.props.fetchNearbySpots({
                language: this.state.l,
                priceLevel: this.state.pl,
                rankBy: this.state.rb,
                type: this.state.t,
                keyword: this.state.k
            });
        }

        let fetchSpotsConstants = () => {
            this.props.fetchSpotsConstants();
        }

        return (
            <div>
                <button onClick={fetchSpotsConstants}>fetch spots constants</button><br />

                <div>fetchingSpots...{this.props.fetchingSpots.toString()}</div>
                <div>spotsFetched...{this.props.spotsFetched.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>

                search keyword:
                <input type="text" onChange={(e) => {this.setState({k: e.target.value})}}/><br/>
                
                choose language: 
                <select onChange={(e) => {this.setState({l: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.languageConstants.map(l => {
                        return <option value={l.api}>{l.display}</option>
                    })}
                </select><br/>

                choose priceLevel: 
                <select onChange={(e) => {this.setState({pl: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.priceLevelConstants.map(pl => {
                        return <option value={pl.api}>{pl.display}</option>
                    })}
                </select><br/>

                choose rankBy: 
                <select onChange={(e) => {this.setState({rb: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.rankByConstants.map(rb => {
                        return <option value={rb.api}>{rb.display}</option>
                    })}
                </select><br/>

                choose type: 
                <select onChange={(e) => {this.setState({t: [e.target.value]})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.typeConstants.map(t => {
                        return <option value={t.api}>{t.display}</option>
                    })}
                </select><br/>

                <button onClick={fetchNearbySpots}>fetch spots</button><br />
                
                <div>spots...<div><pre>{JSON.stringify(this.props.spots, null, 2)}</pre></div></div>
            </div>
        )
    }
}

// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    fetchingSpots: state.spots.fetchingSpots,
    spotsFetched: state.spots.spotsFetched,
    // savingSpots: state.spots.spots,
    // savedSpots: state.spots.savedSpots,
    spots: state.spots.spots,
    errorMsg: state.spots.errorMsg,
    businessStatusConstants: state.spots.businessStatusConstants,
    languageConstants: state.spots.languageConstants,
    priceLevelConstants: state.spots.priceLevelConstants,
    rankByConstants: state.spots.rankByConstants,
    typeConstants: state.spots.typeConstants,
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    fetchNearbySpots,
    fetchSpotsConstants,
    // saveSpot
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSpotsActions.propTypes = {
    // savingSpot: PropTypes.bool.isRequired,
    // savedSpots: PropTypes.Map.isRequired,
    fetchingSpots: PropTypes.bool.isRequired,
    spotsFetched: PropTypes.bool.isRequired,
    // spots: PropTypes.array.isRequired,
    spots: PropTypes.object.isRequired,
    
    businessStatusConstants: PropTypes.array.isRequired,
    languageConstants: PropTypes.array.isRequired,
    priceLevelConstants: PropTypes.array.isRequired,
    rankByConstants: PropTypes.array.isRequired,
    typeConstants: PropTypes.array.isRequired,
    errorMsg: PropTypes.string.isRequired,

    // fetchNearbySpots: PropTypes.func.isRequired,
    // saveSpot: PropTypes.func.isRequired,
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestSpotsActions);