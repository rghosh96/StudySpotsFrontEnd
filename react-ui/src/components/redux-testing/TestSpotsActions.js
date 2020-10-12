import React from 'react';
import '../../styling/master.scss'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSpots, fetchSpotsConstants } from '../../redux/actions/spotsActions';

class TestSpotsActions extends React.Component {
    render() {
        let fetchSpots = () => {
            this.props.fetchSpots();
        }

        let fetchSpotsConstants = () => {
            this.props.fetchSpotsConstants();
        }



        return (
            <div>
                <button onClick={fetchSpots}>fetch spots</button><br />
                <button onClick={fetchSpotsConstants}>fetch spots constants</button><br />

                <div>fetchingSpots...{this.props.fetchingSpots.toString()}</div>
                <div>spotsFetched...{this.props.spotsFetched.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>
                <div>businessStatusConstants...<div><pre>{JSON.stringify(this.props.businessStatusConstants, null, 2)}</pre></div></div>
                <div>languageConstants...<div><pre>{JSON.stringify(this.props.languageConstants, null, 2)}</pre></div></div>
                <div>priceLevelConstants...<div><pre>{JSON.stringify(this.props.priceLevelConstants, null, 2)}</pre></div></div>
                <div>rankByConstants...<div><pre>{JSON.stringify(this.props.rankByConstants, null, 2)}</pre></div></div>
                <div>typeConstants...<div><pre>{JSON.stringify(this.props.typeConstants, null, 2)}</pre></div></div>
                <div>spots...<div><pre>{JSON.stringify(this.props.spots, null, 2)}</pre></div></div>
            </div>
        )
    }
}

// tell redux what properties we want to read from the global store.
const mapStateToProps = state => ({
    fetchingSpots: state.spots.fetchingSpots,
    spotsFetched: state.spots.spotsFetched,
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
    fetchSpots,
    fetchSpotsConstants
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSpotsActions.propTypes = {
    fetchingSpots: PropTypes.bool.isRequired,
    spotsFetched: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    errorMsg: PropTypes.string.isRequired,

    businessStatusConstants: PropTypes.array.isRequired,
    languageConstants: PropTypes.array.isRequired,
    priceLevelConstants: PropTypes.array.isRequired,
    rankByConstants: PropTypes.array.isRequired,
    typeConstants: PropTypes.array.isRequired,

    fetchSpots: PropTypes.func.isRequired
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestSpotsActions);