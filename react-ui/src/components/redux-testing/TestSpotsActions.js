import React from 'react';
import '../../styling/master.scss'

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchSpots } from '../../redux/actions/spotsActions';

class TestSpotsActions extends React.Component {
    render() {
        let fetchSpots = () => {
            console.log('TestSpotsActions');
            this.props.fetchSpots();
        }

        return (
            <div>
                <button onClick={fetchSpots}>fetch spots</button><br />

                <div>fetchingSpots...{this.props.fetchingSpots.toString()}</div>
                <div>spotsFetched...{this.props.spotsFetched.toString()}</div>
                <div>errorMsg...{this.props.errorMsg.toString()}</div>
                <div>spots...
                    <div>
                        <pre>{JSON.stringify(this.props.spots, null, 2)}</pre>
                    </div>
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
    errorMsg: state.spots.errorMsg
});

// tell redux what actions we want to use (the same ones we imported at the top)
const mapDispatchToProps = {
    fetchSpots
}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSpotsActions.propTypes = {
    fetchingSpots: PropTypes.bool.isRequired,
    spotsFetched: PropTypes.bool.isRequired,
    spots: PropTypes.array.isRequired,
    errorMsg: PropTypes.string.isRequired,
    fetchSpots: PropTypes.func.isRequired
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestSpotsActions);