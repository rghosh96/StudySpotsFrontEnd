import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../styling/master.scss';
import LoadSpinner from './LoadSpinner';
import { Button } from 'react-bootstrap';
import { fetchSavedSpotsDetails, removeSavedSpotDetails } from '../../redux/actions/spotsActions';
import { removeSavedSpot, saveSpot } from '../../redux/actions/accountActions';
import Header from '../nav/Header';
import AccessDenied from './AccessDenied';
import history from '../../history';


export default function MySpots() {
    const dispatch = useDispatch();

    const { userData, isSignedIn } = useSelector(state => state.account);
    const { savedSpots, fetchingSpots } = useSelector(state => state.spots);

    const [hasSavedSpots, setHasSavedSpots] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    });

    useEffect(() => {
        if (isSignedIn) {
            if (userData.savedSpots != [])
                dispatch(fetchSavedSpotsDetails(userData.savedSpots));
        }
    }, [isSignedIn, userData]);

    useEffect(() => {
        if (savedSpots.length === 0 && userData.savedSpots.length === 0)
            setHasSavedSpots(false);
        else
            setHasSavedSpots(true);
    }, [savedSpots, userData.savedSpots]);

    const handleClickSpot = (e, placeId) => {
        e.preventDefault();
        history.push("/spotpage/" + placeId)
        window.location.reload();
    }

    const handleClickSave = (e, placeId) => {
        e.preventDefault();

        if (isSignedIn) {
            if (userData.savedSpots.includes(placeId)) {
                dispatch(removeSavedSpot(placeId));
                dispatch(removeSavedSpotDetails(placeId));
            } else {
                dispatch(saveSpot(placeId));
            }
        }
    }

    return loading ?
        <div className="spotlight">
            <div><LoadSpinner /></div>
        </div>
        :
        <div>
            <Header />
            

            <div>
                {!isSignedIn ?
                    <AccessDenied>
                        <div className="gray">You must be signed in to view your saved spots.</div>
                    </AccessDenied>
                    :
                    <div className="spotlight">
                        <h1 className="spotlist-header">{userData.fName}'s spots</h1>
                        {fetchingSpots ?
                            <LoadSpinner />
                            :
                            hasSavedSpots ? savedSpots.map(spot => {
                                let types = '';
                                for (let i = 0; i < (spot.types.length < 3 ? spot.types.length : 3); i++) {
                                    types = types + spot.types[i] + (i === 2 || i + 1 === spot.types.length ? '' : ', ');
                                }

                                return (
                                    <div className="spotcard">

                                        <span onClick={(e) => { handleClickSpot(e, spot.placeId) }}>
                                            <img className="image" src={spot.photos && spot.photos[0].url ? spot.photos[0].url : spot.iconUrl} />
                                        </span>

                                        <span className="spotinfo" onClick={(e) => { handleClickSpot(e, spot.placeId) }}>
                                            <div className="mobile">
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
                                            <Button onClick={(e) => { handleClickSave(e, spot.placeId) }}>
                                                {userData.savedSpots.includes(spot.placeId) ? "Unsave" : "Save"}
                                            </Button>
                                        </span>
                                    </div>
                                )
                            }) : <div className="gray">Looks like there's nothing here. Try saving Spots from the Spotlight page.</div>}

                    </div>
                }
            </div>
        </div>
}