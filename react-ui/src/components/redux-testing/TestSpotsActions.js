import React from 'react';
import '../../styling/master.scss'
import Header from '../nav/Header'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { 
    fetchNearbySpots, fetchSpotDetails, fetchSpotsConstants,
    saveSpot, removeSavedSpot, fetchSavedSpotsDetails,
    submitRating, createComment, deleteComment, updateComment, fetchComments
} from '../../redux/actions/spotsActions';
import PopTimesChart from '../../components/pages/PopTimesChart';

class TestSpotsActions extends React.Component {
    constructor() {
        super();
        this.state = {
            l: '',
            pl: '',
            rb: '',
            t: '',
            k: '',
            // some examples: ChIJa00m55kayYcRnz5WcvjDiMI, ChIJnQKsxvQPyYcRxqw3vavZ3jY
            placeId: '',
            comment: '',
            commentId: '',
            overall: '',
            lighting: '',
            music: '',
            food: '',
            drink: '',
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


        var popularTimes = this.props.activeSpot.popularTimes;
        var popTimesCharts = null;
        if (popularTimes && popularTimes.status === "ok") {
            popTimesCharts = popularTimes.week.map(item => {
                return <div><PopTimesChart day={item.day} hours={item.hours}/></div>
            })
        }

        return (
          <div>
            <Header />
            <div style={{position: "absolute", top: "200px"}}>
                <input type="text" placeholder="comment" onChange={e => this.setState({comment: e.target.value})} /> <br/>
                <input type="text" placeholder="commentId" onChange={e => this.setState({commentId: e.target.value})} /> <br/>
                
                placeId: ChIJ84Inr4tryYcRlJKIRCmfw0Y <br/>
                <button onClick={() => this.props.createComment(this.state.placeId, this.state.comment)}>create comment</button><br />
                <button onClick={() => this.props.deleteComment(this.state.placeId, this.state.commentId)}>delete comment</button><br />
                <button onClick={() => this.props.updateComment(this.state.placeId, this.state.commentId, this.state.comment)}>update comments</button><br />
                <button onClick={() => this.props.fetchComments(this.state.placeId)}>fetch comments</button><br />
                <div>creating comment...{this.props.creatingComment.toString()}</div>



                <input type="text" placeholder="placeId" onChange={e => this.setState({placeId: e.target.value})} /> <br/>
                <input type="text" placeholder="overall rating" onChange={e => this.setState({overall: e.target.value})} /> <br/>
                <input type="text" placeholder="lighting rating" onChange={e => this.setState({lighting: e.target.value})} /> <br/>
                <input type="text" placeholder="music rating" onChange={e => this.setState({music: e.target.value})} /> <br/>
                <input type="text" placeholder="food rating" onChange={e => this.setState({food: e.target.value})} /> <br/>
                <input type="text" placeholder="drink rating" onChange={e => this.setState({drink: e.target.value})} /> <br/>
                <br/>
                <div>submittingRating...{this.props.submittingRating.toString()}</div>
                <div>savingSpot...{this.props.savingSpot.toString()}</div>
                <div>removingSpot...{this.props.removingSpot.toString()}</div>
                <button onClick={() => this.props.submitRating(this.state.placeId, {
                    overall: this.state.overall,
                    lighting: this.state.lighting,
                    music: this.state.music,
                    food: this.state.food,
                    drink: this.state.drink,
                })}>submit rating</button><br/>
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
                        return <option key={l.api} value={l.api}>{l.display}</option>
                    })}
                </select>
                <br/>

                choose priceLevel: 
                <select onChange={(e) => {this.setState({pl: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.priceLevelConstants.map(pl => {
                        return <option key={pl.api} value={pl.api}>{pl.display}</option>
                    })}
                </select>
                <br/>

                choose rankBy: 
                <select onChange={(e) => {this.setState({rb: e.target.value})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.rankByConstants.map(rb => {
                        return <option key={rb.api} value={rb.api}>{rb.display}</option>
                    })}
                </select>
                <br/>

                choose type: 
                <select onChange={(e) => {this.setState({t: [e.target.value]})}}>
                    <option value="" selected disabled hidden>Choose...</option>
                    {this.props.typeConstants.map(t => {
                        return <option key={t.api} value={t.api}>{t.display}</option>
                    })}
                </select>
                <br/>

                <input type="text" placeholder="placeId" onChange={e => {this.setState({placeId: e.target.value})}}/>
                <button onClick={fetchSpotDetails}>fetch active spot</button>
                {popTimesCharts}
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
    
    submittingRating: state.spots.submittingRating,
    savingSpot: state.spots.savingSpot,
    removingSpot: state.spots.removingSpot,
    savedSpots: state.spots.savedSpots,

    creatingComment: state.spots.creatingComment,
    deletingComment: state.spots.deletingComment,
    updatingComment: state.spots.updatingComment,
    fetchingComments: state.spots.fetchingComments,

    
    
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
    submitRating,
    createComment,
    deleteComment,
    updateComment,
    fetchComments,

}

// tell this component what it will be getting from redux. these members can be accessed using this.props
TestSpotsActions.propTypes = {
    submittingRating: PropTypes.bool.isRequired,
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
    removeSavedSpot: PropTypes.func.isRequired,
    fetchSavedSpotsDetails: PropTypes.func.isRequired,
    submitRating: PropTypes.func.isRequired,

    createComment: PropTypes.func.isRequired,
    deleteComment: PropTypes.func.isRequired,
    updateComment: PropTypes.func.isRequired,
    fetchComments: PropTypes.func.isRequired,

    creatingComment: PropTypes.bool.isRequired,
    deletingComment: PropTypes.bool.isRequired,
    updatingComment: PropTypes.bool.isRequired,
    fetchingComments: PropTypes.bool.isRequired,



    
    userData: PropTypes.object.isRequired
};

// finally, link this component to the redux actions and global properties using the function we imported
export default connect(mapStateToProps, mapDispatchToProps)(TestSpotsActions);