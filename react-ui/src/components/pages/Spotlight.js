import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import { saveSpot, fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants } from '../../redux/actions/spotsActions';
import Header from '../nav/Header'
import { Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap'

class Spotlight extends React.Component {
    state = {
        loading: true
    }

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
        this.props.fetchSpotsConstants();
        this.props.fetchNearbySpots({ type: 'cafe' });
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

    handleClickSpot = (placeId) => {
        this.setState({ redirect: true, placeId: placeId })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={"/spotpage?placeid=" + this.state.placeId} />
        } else {
            return (
                <div>
                    <Header />

                    <h1>Spotlight</h1>

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
                                />
                            </InputGroup>
                        </div>

                        <div className="filterarea">
                            <span className="filterbtn">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {this.state.minplDisp === '' ? "Select Min Price" : this.state.minplDisp}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {this.props.priceLevelConstants.map(pl => <Dropdown.Item key={pl.api} onSelect={(e) => { this.setState({ minpl: pl.api, minplDisp: pl.display }) }}>{pl.display}</Dropdown.Item>)}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </span>

                            <span className="filterbtn">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {this.state.maxplDisp === '' ? "Select Max Price" : this.state.maxplDisp}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        {this.props.priceLevelConstants.map(pl => <Dropdown.Item key={pl.api} onSelect={(e) => { this.setState({ maxpl: pl.api, maxplDisp: pl.display }) }}>{pl.display}</Dropdown.Item>)}

                                    </Dropdown.Menu>
                                </Dropdown>
                            </span>

                            <span className="filterbtn">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        {this.state.tDisp === '' ? "Select Type" : this.state.tDisp}
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
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
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
                                // let chart;
                                // if (spot.popularTimes.week) {
                                //     let date = new Date();
                                //     let day = date.getDay();
                                //     let busy;
                                //     let currentHour = date.getHours();
                                //     let popTimesToday = spot.popularTimes.week[day]

                                //     chart = (<PopTimesChart day={popTimesToday.day} hours={popTimesToday.hours} />)

                                // }
                                // else {
                                //     chart = "Unavailable :("
                                // }

                                let types = '';
                                for (let i = 0; i < (spot.types.length < 3 ? spot.types.length : 3); i++) {
                                    types = types + spot.types[i] + (i === 2 || i + 1 === spot.types.length ? '' : ', ');
                                }

                                return (
                                    <div className="spotcard" onClick={() => {this.handleClickSpot(spot.placeId)}}>

                                        <span >
                                            <img className="image" src={spot.photos && spot.photos[0].url ? spot.photos[0].url : spot.iconUrl} />
                                        </span>

                                        <span>
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

                                        {/* <span> */}
                                        {/* <div className="popular">
                                        popular times
                                    </div> */}

                                        {/* <div className="busy">
                                       
                                    </div> */}
                                        {/* </span> */}

                                        {/* <span className="times">
                                    {/* code for chart */}
                                        {/* {chart} */}
                                        {/* </span> */}

                                        <span>
                                            <Button onClick={() => {this.props.saveSpot(spot.placeId)}}>Save</Button>
                                        </span>
                                    </div>
                                )
                            }) : "We couldn't find any spots at the moment, our apologies"}
                    </div>

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
    fetchSpotDetails,
    saveSpot,
}

Spotlight.propTypes = {
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
};


export default connect(mapStateToProps, mapDispatchToProps)(Spotlight);
