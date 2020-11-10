import React from 'react';
import '../../styling/master.scss'
import LoadSpinner from './LoadSpinner'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown, Form } from 'react-bootstrap';
import { saveSpot, fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants } from '../../redux/actions/spotsActions';
import Header from '../nav/Header'
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';
import { Button } from 'react-bootstrap'

class Spotlight extends React.Component {
    state = {
        selection: 'filter0',
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
                // language: this.state.l,
                // priceLevel: this.state.pl,
                // rankBy: this.state.rb,
                // type: this.state.t,
                // keyword: this.state.k
                language: "English",
                priceLevel: "2",
               // rankBy: "prominence",
                type: ["cafe"],
                keyword: "coffee"
            });}

        if (this.state.loading) {
            return <LoadSpinner/>
        }
        else {
            return (
                <div>
                    {console.log(this.props.spots)}
                    <Header />
                    <h1 onClick={fetchNearbySpots}>Spotlight</h1>

                    <div className="filterArea">
                    <Form.Control onChange={this.handleChange} id="selection" as="select" >
                    <option value="filter0">select an option...</option>
                    <option value="filter1">Price</option>
                    <option value="filter2">Location Type</option>
                    <option value="filter3">Importance</option>
                    </Form.Control>
            
                
                    {this.state.selection == 'filter1' ? 
                    <div>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Price
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        {this.props.priceLevelConstants.map(pl => <Dropdown.Item key={pl.api}  onSelect={(e) => {this.setState({pl: pl.api})}}>{pl.display}</Dropdown.Item>) }
                        <Dropdown.Divider />
                        <Dropdown.Item  onSelect={(e) => {this.setState({t: '', pl: '', rb: ''})}}>Reset Filters</Dropdown.Item>       
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                                    : null
                    }


                    {this.state.selection == 'filter2' ? 
                    <div>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Type
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        {this.props.typeConstants.map(t => <Dropdown.Item key={t.api}  onSelect={(e) => {this.setState({t: t.api})}}>{t.display}</Dropdown.Item>) }    
                        <Dropdown.Divider />
                        <Dropdown.Item  onSelect={(e) => {this.setState({t: '', pl: '', rb: ''})}}>Reset Filters</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                                    : null
                    }


                    {this.state.selection == 'filter3' ? 
                    <div>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Select Importance
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                        {this.props.rankByConstants.map(rb => <Dropdown.Item key={rb.api}  onSelect={(e) => {this.setState({rb: rb.api})}}>{rb.display}</Dropdown.Item>) }
                        <Dropdown.Divider />
                        <Dropdown.Item  onSelect={(e) => {this.setState({t: '', pl: '', rb: ''})}}>Reset Filters</Dropdown.Item>       
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>
                                    : null
                    }
                    <Button onClick={fetchNearbySpots}>Search</Button>
                    </div>

                    {this.props.spots && this.props.spots.map(spot => {
                        return (
                    <div className="container">
                        
                         <h1>spotlight</h1> 
                       
                                <CardColumns>
                                    {/* commented out because it was throwing errors*/}
                                    {/* <Card.Img className="image">{spot.iconUrl}</Card.Img> */}
                                    <Card.Body className="cardBody">
                                        <Card.Title className="cardTitle">{spot.name}</Card.Title>
                                        <Card.Text className="text">
                                            <div className="open">
                                            {spot.openNow ? "Open" : "Closed"}
                                            </div>
                                            
                                            <div>Type: goes here</div>
                                        </Card.Text>
                                        <h1>popular times</h1>
                                        <div><Button onClick={saveSpot}>Save</Button></div>
                                       
                                    </Card.Body>
                                </CardColumns>
                    </div>
                        )
                     })}
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
};


export default connect(mapStateToProps, mapDispatchToProps)(Spotlight);