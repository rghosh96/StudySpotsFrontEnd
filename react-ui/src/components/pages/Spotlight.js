import React from 'react';
import '../../styling/master.scss'
import history from '../../history';
import LoadSpinner from './LoadSpinner'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, InputGroup, FormControl, Button } from 'react-bootstrap';
import { fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants } from '../../redux/actions/spotsActions';
import { saveSpot, removeSavedSpot } from '../../redux/actions/accountActions';
import Header from '../nav/Header'
import { Redirect } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';


class Spotlight extends React.Component {
    constructor() {
        super()
        this.state = {
            l: '',
            lDisp: '',
            minpl: '',
            minplDisp: '',
            maxpl: '',
            maxplDisp: '',
            rb: '',
            rbDisp: '',
            t: 'cafe',  // default to cafe (best study spots)
            tDisp: '',
            k: '',
            placeId: '',
            redirect: false,
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
        })
    }

    handleKeywordEnter = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            this.fetchNearbySpots();
        }
    }

    // "loading"
    componentDidMount() {
        this.props.fetchNearbySpots({ type: 'cafe' });
        window.scrollTo(0, 0);
    }

    resetFilters = () => {
        this.setState({ tDisp: '', t: 'cafe', minplDisp: '', minpl: '', maxplDisp: '', maxpl: '', rbDisp: '', rb: '', k: '' })
    }

    fetchNearbySpots = () => {
        this.props.fetchNearbySpots({
            language: this.state.l === '' ? null : this.state.l,
            minPriceLevel: this.state.minpl === '' ? null : this.state.minpl,
            maxPriceLevel: this.state.maxpl === '' ? null : this.state.maxpl,
            rankBy: this.state.rb === '' ? null : this.state.rb,
            type: this.state.t === '' ? null : this.state.t,
            keyword: this.state.k === '' ? null : this.state.k,
        });
    }

    handleClickSpot = (e, placeId) => {
        e.preventDefault();
        history.push("/spotpage/" + placeId)
        window.location.reload();
        // this.setState({ redirect: true, placeId: placeId })
    }

    handleClickSave = (e, placeId) => {
        e.preventDefault();

        if (this.props.isSignedIn) {
            if (this.props.userData.savedSpots.includes(placeId)) {
                this.props.removeSavedSpot(placeId);
            } else {
                this.props.saveSpot(placeId)
            }
        }
    }

    render() {
        return (
            <div>
                <Header />
                <h1 className="spotlist-header">spotlight</h1>
                <div className="spotlight">
                    <div className="keywordarea">
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroup-sizing-default">Keyword</InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                aria-label="Default"
                                aria-describedby="inputGroup-sizing-default"
                                onChange={(e) => { this.setState({ k: e.target.value }) }}
                                onKeyDown={this.handleKeywordEnter}
                                value={this.state.k}
                            />
                        </InputGroup>
                    </div>

                    <div className="filterarea">
                        <span className="filterbtn">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {this.state.minplDisp === '' ? "Min Price" : this.state.minplDisp}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.props.priceLevelConstants.map(pl => <Dropdown.Item key={pl.api} onSelect={(e) => { this.setState({ minpl: pl.api, minplDisp: pl.display }) }}>{pl.display}</Dropdown.Item>)}

                                </Dropdown.Menu>
                            </Dropdown>
                        </span>

                        <span className="filterbtn">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {this.state.maxplDisp === '' ? "Max Price" : this.state.maxplDisp}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.props.priceLevelConstants.map(pl => <Dropdown.Item key={pl.api} onSelect={(e) => { this.setState({ maxpl: pl.api, maxplDisp: pl.display }) }}>{pl.display}</Dropdown.Item>)}

                                </Dropdown.Menu>
                            </Dropdown>
                        </span>

                        <span className="filterbtn">
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {this.state.tDisp === '' ? "Type" : this.state.tDisp}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {this.props.typeConstants.map(t => <Dropdown.Item key={t.api} onSelect={(e) => { this.setState({ t: t.api, tDisp: t.display }) }}>{t.display}</Dropdown.Item>)}

                                </Dropdown.Menu>
                            </Dropdown>
                        </span>

                        {this.state.t === '' && this.state.k === '' ?
                            null
                            :
                            <span className="filterbtn">
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic">
                                        {this.state.rbDisp === '' ? "Rank By" : this.state.rbDisp}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {this.props.rankByConstants.map(rb => <Dropdown.Item key={rb.api} onSelect={(e) => { this.setState({ rb: rb.api, rbDisp: rb.display }) }}>{rb.display}</Dropdown.Item>)}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </span>
                        }
                    </div>

                    <div className="searcharea">
                        <span className="filterbtn"><Button onClick={this.fetchNearbySpots}>Search</Button></span>
                        <span className="filterbtn"><Button onClick={this.resetFilters}>Reset</Button></span>
                    </div>

                    {this.props.fetchingSpots ?
                        <LoadSpinner />
                        :
                        this.props.spots ? this.props.spots.map(spot => {

                            let types = '';
                            for (let i = 0; i < (spot.types.length < 3 ? spot.types.length : 3); i++) {
                                types = types + spot.types[i] + (i === 2 || i + 1 === spot.types.length ? '' : ', ');
                            }

                            return (
                                <div className="spotcard">

                                    <span onClick={(e) => { this.handleClickSpot(e, spot.placeId) }}>
                                        <img className="image" src={spot.photos && spot.photos[0].url ? spot.photos[0].url : spot.iconUrl} />
                                    </span>

                                    <span className="spotinfo" onClick={(e) => { this.handleClickSpot(e, spot.placeId) }}>
                                        <div>
                                            <span className="title" >
                                                {spot.name}
                                            </span>

                                            <span className="open">
                                                {spot.openNow == null ? "Status Unknown" : (spot.openNow ? "Open" : "Closed")}
                                            </span>
                                        </div>
                                        <div className="gray">
                                            {spot.distance} miles away
                                            </div>

                                        <div className="gray">
                                            {types}
                                        </div>
                                    </span>

                                    <span>
                                        {this.props.isSignedIn ?
                                            <Button onClick={(e) => { this.handleClickSave(e, spot.placeId) }}>{this.props.userData.savedSpots.includes(spot.placeId) ? "Unsave" : "Save"}</Button>
                                            :
                                            <>
                                                <a data-tip data-for='saveBtn'>
                                                    <Button onClick={(e) => { this.handleClickSave(e, spot.placeId) }}>Save</Button>
                                                </a>
                                                <ReactTooltip id='saveBtn' type='dark' effect='float'>
                                                    <span>Create an account to save this spot (it's free!)</span>
                                                </ReactTooltip>
                                            </>
                                        }
                                    </span>
                                </div>
                            )
                        }) : "We couldn't find any spots at the moment, our apologies"}
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isSignedIn: state.account.isSignedIn,
    userData: state.account.userData,
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
    fetchSpotDetails,
    saveSpot,
    removeSavedSpot,
}

Spotlight.propTypes = {
    isSignedIn: PropTypes.bool.isRequired,
    userData: PropTypes.object.isRequired,
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
    saveSpot: PropTypes.func.isRequired,
    removeSavedSpot: PropTypes.func.isRequired,
};


export default connect(mapStateToProps, mapDispatchToProps)(Spotlight);
