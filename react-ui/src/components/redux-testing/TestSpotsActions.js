import React from 'react';
import '../../styling/master.scss'
import Header from '../nav/Header'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
    fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants,
    saveSpot, removeSavedSpot, fetchSavedSpotsDetails
} from '../../redux/actions/spotsActions';

class TestSpotsActions extends React.Component {
    constructor() {
        super()
        this.state = {
            l: '',
            pl: '',
            rb: '',
            t: '',
            k: '',
            // some examples: ChIJa00m55kayYcRnz5WcvjDiMI, ChIJnQKsxvQPyYcRxqw3vavZ3jY
            placeId: '',
        }
    }

    componentDidMount() {
        this.props.fetchSpotsConstants();
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

        const fetchSpotDetails = () => {
            this.props.fetchSpotDetails(this.state.placeId);
        };

        const fetchSpotsConstants = () => {
            this.props.fetchSpotsConstants();
        };

        const fetchSavedSpotsDetails = () => {
            this.props.fetchSavedSpotsDetails(this.props.userData.savedSpots);
        };

        console.log(this.state)

        return (
          <div>
            <Header />
            <div style={{position: "absolute", top: "200px"}}>
                <button onClick={fetchSpotsConstants}>fetch spots constants</button><br />
                <div>savingSpot...{this.props.savingSpot.toString()}</div>
                <div>removingSpot...{this.props.removingSpot.toString()}</div>
                <input type="text" placeholder="placeId" onChange={e => this.setState({placeId: e.target.value})} />
                <br/>
                <button onClick={() => this.props.saveSpot(this.state.placeId)}>save spot</button><br/>
                <button onClick={() => this.props.removeSavedSpot(this.state.placeId)}>remove spot</button><br/>
                <button onClick={fetchSavedSpotsDetails}>fetched saved spots</button><br/>
                <div>userData...</div>
                <div style={{maxHeight: "1000px", maxWidth: "1200px", overflow: "auto"}}><pre>{JSON.stringify(this.props.userData, null, 2)}</pre></div>
                <br/>
                <div>savedSpots...</div>
                <div style={{maxHeight: "1000px", maxWidth: "1200px", overflow: "auto"}}><pre>{JSON.stringify(this.props.savedSpots, null, 2)}</pre></div>
                <br/>

                <button onClick={fetchSpotsConstants}>fetch spots constants</button><br />
                <div>fetchingSpots...{this.props.fetchingSpots.toString()}</div>
                <div>spotsFetched...{this.props.spotsFetched.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>

                search keyword:
                <input type="text" onChange={(e) => {this.setState({k: e.target.value})}}/>
                <br/>
                
                choose language: 
                <select onChange={(e) => {this.setState({l: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.languageConstants.map(l => {
                        return <option value={l.api}>{l.display}</option>
                    })}
                </select>
                <br/>

                choose priceLevel: 
                <select onChange={(e) => {this.setState({pl: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.priceLevelConstants.map(pl => {
                        return <option value={pl.api}>{pl.display}</option>
                    })}
                </select>
                <br/>

                choose rankBy: 
                <select onChange={(e) => {this.setState({rb: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.rankByConstants.map(rb => {
                        return <option value={rb.api}>{rb.display}</option>
                    })}
                </select>
                <br/>

                choose type: 
                <select onChange={(e) => {this.setState({t: [e.target.value]})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.typeConstants.map(t => {
                        return <option value={t.api}>{t.display}</option>
                    })}
                </select>
                <br/>

                <input type="text" placeholder="placeId" onChange={e => {this.setState({placeId: e.target.value})}}/>
                <button onClick={fetchSpotDetails}>fetch active spot</button>
                <div>activeSpot...<div style={{maxHeight: "1000px", maxWidth: "1200px", overflow: "auto"}}><pre>{JSON.stringify(this.props.activeSpot, null, 2)}</pre></div></div>
                <br/>
                
                <button onClick={fetchNearbySpots}>fetch spots</button><br />
                <div>spots...<div style={{maxHeight: "1000px", maxWidth: "1200px", overflow: "auto"}}><pre>{JSON.stringify(this.props.spots, null, 2)}</pre></div></div>
                <br/>
            </div>
          </div>
        )
    }
}

// tell redux what properties we want to read from the global store.
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
    
    savingSpot: state.spots.savingSpot,
    removingSpot: state.spots.removingSpot,
    savedSpots: state.spots.savedSpots,
    
    userData: state.account.userData
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    fetchNearbySpots,
    fetchSpotsConstants,
    fetchSpotDetails,
    saveSpot,
    removeSavedSpot,
    fetchSavedSpotsDetails: fetchSavedSpotsDetails,
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSpotsActions.propTypes = {
    savingSpot: PropTypes.bool.isRequired,
    removingSpot: PropTypes.bool.isRequired,
    fetchingSpots: PropTypes.bool.isRequired,
    spotsFetched: PropTypes.bool.isRequired,
    savedSpots: PropTypes.array.isRequired,
    spots: PropTypes.array.isRequired,
    errorMsg: PropTypes.string.isRequired,
    businessStatusConstants: PropTypes.array.isRequired,
    languageConstants: PropTypes.array.isRequired,
    priceLevelConstants: PropTypes.array.isRequired,
    rankByConstants: PropTypes.array.isRequired,
    typeConstants: PropTypes.array.isRequired,
    
    fetchSpotsConstants: PropTypes.func.isRequired,
    fetchNearbySpots: PropTypes.func.isRequired,
    fetchSpotDetails: PropTypes.func.isRequired,
    
    saveSpot: PropTypes.func.isRequired,
    removeSpot: PropTypes.func.isRequired,
    fetchSavedSpotsDetails: PropTypes.func.isRequired,
    
    userData: PropTypes.object.isRequired
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestSpotsActions);