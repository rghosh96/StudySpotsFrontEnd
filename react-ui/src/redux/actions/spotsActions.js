/* The flow of Places data retrieval goes like this (Note: all requests require an API key):

   (https://developers.google.com/places/web-service/search)
   1. send a Place Search request with optional parameters described above. Returns 20 results at a times 
       - The following parameters are required:
           - key: API key
           - location: lat/long for data retrieval
           - radius: in meters
       - you can specify what kind of data to return:
           - Basic: place_id, types, business_status, formatted_address, geometry, icon, name, photos, plus_code
           - Contact: opening_hours
           - Atmosphere: price_level, rating, user_ratings_total
       - pagination (returns next 20 results of prev search)
           - pagetoken
       - Example request: https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=YOUR_API_KEY
       - More on Place data fields: https://developers.google.com/places/web-service/place-data-fields

   (Optional: we may want to look into the Autocomplete search feature, https://developers.google.com/places/web-service/autocomplete)

   (https://developers.google.com/places/web-service/details)
   2. send a Place Details request with place_id (from above) as param. The most useful data for a place
       is already returned from a Place Search request, but this can be used to get more detailed info on
       addresses and hours of business.
       - Example request: https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJN1t_tDeuEmsRUsoyG83frY4&fields=name,rating,formatted_phone_number&key=YOUR_API_KEY

   (https://developers.google.com/places/web-service/photos)
   3. send a Place Photos request with photo_reference from above requests as param. can also take
       specific dimensions you want your image in. returns the image itself (not a link)
       - Example: https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=CnRtAAAATLZNl354RwP_9UKbQ_5Psy40texXePv4oAlgP4qNEkdIrkyse7rPXYGd9D_Uj1rVsQdWT4oRz4QrYAJNpFX7rzqqMlZw2h2E2y5IKMUZ7ouD_SlcHxYq1yL4KbKUv3qtWgTK0A6QbGh87GB3sscrHRIQiG2RrmU_jF4tENr9wGS_YxoUSSDrYjWmrNfeEHSGSc3FyhNLlBU&key=YOUR_API_KEY

   IMPORTANT NOTE: this link (https://developers.google.com/places/web-service/supported_types)
       contains a list of TYPES of places that can be returned from the API. these types include 
       "cafe", "library", "restaurant", and many others. types of a location are returned from a Place Search
*/


import {
    FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE,
    FETCH_SPOTS_CONSTANTS_SUCCESS, FETCH_SPOTS_CONSTANTS_FAILURE,
    FETCH_SPOT_DETAILS,
    SAVE_SPOT, REMOVE_SAVED_SPOT, FETCH_SAVED_SPOTS_DETAILS
} from '../actions/types';
import {
    SUCCESS, INTERNAL_SERVER, SPOT_CONSTANTS_ERROR, USER_DENIED_LOCATION, USER_NOT_SIGNED_IN,
    SPOT_SAVED, SPOT_REMOVED, MISSING_PLACE_IDS, STATUS_UNAVAILABLE
} from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import {
    mapify, mapGetArray, placesPeriodsReducer, placesPhotosReducer, placesReviewsReducer, placesTypesReducer
} from '../../helpers/dataStructureHelpers';
import popularTimes from '../../services/popularTimes';


// these maps are used to turn enums returned by api calls into text that can
// be displayed to the user (the values from Firestore). 
// see helpers.dataStructureHelpers.mapify() and fetchSpotsConstants()
//
// example: businessStatusMapMap.get(response.business_status) 
// returns "Temporarily closed" when response.business_status === "TEMPORARILY_CLOSED"
var placesRequestStatusMap = undefined;
var businessStatusMap = undefined;
var typesMap = undefined;
var priceLevelMap = undefined;

const NEARBY_SEARCH_RADIUS = 500; // in meters (about 6 miles). max is 50000


// fetches the constants from Firestore which are necessary to make API calls
// and display options during spot search
export const fetchSpotsConstants = () => (dispatch) => {
    const firestore = getFirebase().firestore(); //connect to firebase

    firestore.collection('constants').doc("googlePlaces").get()
        .then(doc => {
            const constants = doc.data();

            businessStatusMap = mapify(constants.business_status, "api", "display");
            typesMap = mapify(constants.types, "api", "display");
            placesRequestStatusMap = mapify(constants.status, "api", "display");
            priceLevelMap = mapify(constants.price_level, "api", "display");

            dispatch({
                type: FETCH_SPOTS_CONSTANTS_SUCCESS,
                payload: {
                    businessStatusConstants: constants.business_status,
                    languageConstants: constants.language,
                    priceLevelConstants: constants.price_level,
                    rankByConstants: constants.rankby,
                    typeConstants: constants.types,
                }
            });
        })
        .catch(error => {
            dispatch({
                type: FETCH_SPOTS_CONSTANTS_FAILURE,
                payload: error.message
            });
        });
};


/*  (optional. these are params we can pass directly to a Place Search Request)
    params: {
        type: constants.api,     (enum list stored in our db, matching Google's types
        keyword: <string>,   (phone number, address, name; pretty much anything you would put in a Google search)
        language: constants.api,    (language code: https://developers.google.com/maps/faq#languagesupport)
        openNow: <boolean>,  (if true, only return places open now)
        rankBy: constants.api,      (possible values: prominence (importance), distance (latter requires types or keyword))  
        minPriceLevel: constants.api,  (0-4 0 = lowest)
        maxPriceLevel: constants.api, (0-4 = lowest)
        pageToken: <number>  (for pagination, starting at page 0; the page number of results in case of >20 results)
    }
*/
export const fetchNearbySpots = (params) => (dispatch) => {
    dispatch({ type: FETCH_SPOTS_REQUEST });
    console.log(params)
    try {
        // this will force a browser popup that asks permission to use the user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                if (latitude && longitude) {
                    var here = new window.google.maps.LatLng(latitude, longitude);
                    // var map = new google.maps.Map(document.getElementById('map'), {
                    //     center: here,
                    //     zoom: 15
                    // })

                    // use map from above instead of createElement to integrate Google maps 
                    var service = new window.google.maps.places.PlacesService(document.createElement('div')); // a dummy element
                    service.nearbySearch(
                        // request params
                        {
                            location: here,
                            radius: NEARBY_SEARCH_RADIUS,
                            type: params.type || null,
                            language: params.language || null,
                            keyword: params.keyword || null,
                            openNow: params.openNow || null,
                            rankBy: params.rankBy || null,
                            minPriceLevel: params.minPriceLevel || null,
                            maxPriceLevel: params.maxPriceLevel || null,
                            pageToken: params.pageToken || null,
                        },

                        // callback to handle response/errors
                        async (results, status) => {
                            console.log(status)
                            console.log(results)
                            if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                                // use for maps integration
                                // for (var i = 0; i < results.length; i++) {
                                //     createMarker(results[i]);
                                // }

                                Promise.all(await results.map(async r => {
                                    var urlService = new window.google.maps.places.PlacesService(document.createElement('div'));

                                    return new Promise(async (resolve, reject) => {
                                        // get the url of the place since it is not returned by nearbySearch
                                        await urlService.getDetails(
                                            {
                                                placeId: r.place_id,
                                                fields: ["url"]
                                            },

                                            async (results, status) => {
                                                console.log(status)
                                                console.log(results)
                                                try {
                                                    if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                                                        let popTimes = await popularTimes(await results.url);

                                                        let spot = {
                                                            placeId: r.place_id,
                                                            name: r.name,
                                                            businessStatus: businessStatusMap ? businessStatusMap.get(r.business_status) : STATUS_UNAVAILABLE,
                                                            iconUrl: r.icon,
                                                            openNow: r.opening_hours ? r.opening_hours.isOpen() : null,
                                                            popularTimes: await popTimes,
                                                            vicinity: r.vicinity, // almost always an address
                                                            photos: r.photos, // [{ height, premade html element, width }]
                                                            types: typesMap && r.types ? mapGetArray(typesMap, r.types) : [],
                                                            rating: r.rating,
                                                            userRatingsTotal: r.user_ratings_total,
                                                            url: results.url
                                                        };

                                                        resolve(await spot);
                                                    } else {
                                                        throw new Error(placesRequestStatusMap ? placesRequestStatusMap.get(status) : SPOT_CONSTANTS_ERROR);
                                                    }
                                                } catch(error) { 
                                                    dispatch({
                                                        type: FETCH_SPOTS_FAILURE,
                                                        payload: error.message
                                                    });
                                                }
                                            }
                                        );
                                    });
                                }))
                                    .then(async spots => {
                                        dispatch({
                                            type: FETCH_SPOTS_SUCCESS,
                                            payload: await spots
                                        });
                                    })
                            } else {
                                //stops application
                                throw new Error(placesRequestStatusMap ? placesRequestStatusMap.get(status) : SPOT_CONSTANTS_ERROR);
                            }
                        }
                    );
                } else {
                    throw new Error(USER_DENIED_LOCATION);
                }
            }
        );
    } catch (error) {
        dispatch({
            type: FETCH_SPOTS_FAILURE,
            payload: error.message
        });
    }
};


// given a placeId, fetches the details for that place from the Spots API.
// placeId example (starbucks in Rogers): ChIJnQKsxvQPyYcRxqw3vavZ3jY
//
// onSuccess(spot): a callback which takes the spot details and dispatches accordingly
// onFailure(status): a callback which dispatches in case of failure, takes the status of the request
const fetchAPISpotDetails = (placeId, onSuccess, onFailure) => {
    var service = new window.google.maps.places.PlacesService(document.createElement('div'));

    service.getDetails(
        {
            placeId: placeId,
            // return only the fields specified
            fields: [
                "place_id",
                "name",
                "business_status",
                "formatted_address",
                "formatted_phone_number",
                "icon",
                "types",
                "opening_hours",
                "photos",
                "price_level",
                "rating",
                "review",
                "url"
            ]
        },

        async (results, status) => {
            if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                let popTimes = await popularTimes(results.url);

                // createMarker(place); // for usage with map
                let spotDetails = {
                    placeId: results.place_id,
                    name: results.name,
                    businessStatus: businessStatusMap.get(results.business_status),
                    formattedAddress: results.formatted_address,
                    formattedPhoneNumber: results.formatted_phone_number,
                    iconUrl: results.icon,
                    types: placesTypesReducer(results.types),
                    openNow: results.opening_hours.isOpen(),
                    openHours: placesPeriodsReducer(results.opening_hours.periods),
                    popularTimes: await popTimes,
                    photos: placesPhotosReducer(results.photos),
                    priceLevel: priceLevelMap.get(results.price_level),
                    rating: results.rating,
                    reviews: placesReviewsReducer(results.reviews),
                }

                onSuccess(spotDetails);
            } else {
                onFailure(status);
            }
        }
    );
}


// calls fetchAPISpotDetails with the appropriate dispatches
export const fetchSpotDetails = (placeId) => dispatch => {
    dispatch({
        type: FETCH_SPOT_DETAILS,
        payload: {
            fetchingSpots: true
        }
    });

    const onSuccess = (spot) => {
        dispatch({
            type: FETCH_SPOT_DETAILS,
            payload: {
                spotDetails: spot,
                fetchingSpots: false,
                spotsFetched: true,
            }
        });
    }

    const onFailure = (status) => {
        var errorMsg = status;

        if (placesRequestStatusMap) {
            errorMsg = placesRequestStatusMap.get(status) || status;
        }

        dispatch({
            type: FETCH_SPOT_DETAILS,
            payload: {
                fetchingSpots: false,
                errorMsg: errorMsg
            }
        });
    }

    fetchAPISpotDetails(placeId, onSuccess, onFailure);
}


// given an array of placeIds, fetches the data for each placeId that was 
// passed and sends spot details to reducer
// (this should only be called when a user is signed in, but it won't check explicitly
// since non-members should not have access to My Spots)
export const fetchSavedSpotsDetails = (placeIds) => dispatch => {

    // if no array of placeIds is given, fail
    if (placeIds.length < 1) {
        dispatch({
            type: FETCH_SAVED_SPOTS_DETAILS,
            payload: {
                fetchingSpots: false,
                errorMsg: MISSING_PLACE_IDS
            }
        });

        return;
    }

    dispatch({
        type: FETCH_SAVED_SPOTS_DETAILS,
        payload: {
            fetchingSpots: true,
        }
    });

    const onFailure = (status) => {
        var errorMsg = status;

        if (placesRequestStatusMap) {
            errorMsg = placesRequestStatusMap.get(status) || status;
        }

        dispatch({
            type: FETCH_SAVED_SPOTS_DETAILS,
            payload: {
                fetchingSpots: false,
                errorMsg: errorMsg
            }
        });
    };

    // dispatch the spot details on success
    const onSuccess = (spot) => {
        dispatch({
            type: FETCH_SAVED_SPOTS_DETAILS,
            payload: {
                fetchingSpots: false,
                spotsFetched: true,
                errorMsg: SUCCESS,
                spotsDetails: spot
            }
        });
    };

    // repeat for each id given
    placeIds.forEach(id => {
        fetchAPISpotDetails(id, onSuccess, onFailure);
    });
}


// adds placeId to the current user's savedSpots in Firestore, then calls 
// spotsActions.fetchSpotDetails(), and the details are passed into the reducer
// to create a new entry in the redux savedSpots Map
export const saveSpot = (placeId) => (dispatch) => {
    dispatch({
        type: SAVE_SPOT,
        payload: {
            savingSpot: true
        }
    });

    const firebase = getFirebase(); // connect to firebase
    const firestore = getFirebase().firestore();
    const user = firebase.auth().currentUser;

    if (!user) {
        // user isn't signed in
        dispatch({
            type: SAVE_SPOT,
            payload: {
                errorMsg: USER_NOT_SIGNED_IN,
                savingSpot: false
            }
        })
    } else {
        var userRef = firestore.collection("users").doc(user.uid.toString());

        // Atomically add a new placeId to the savedSpots array field.
        userRef.update({
            savedSpots: firebase.firestore.FieldValue.arrayUnion(placeId)
        })
            .then(() => {
                dispatch({
                    type: SAVE_SPOT,
                    payload: {
                        errorMsg: SPOT_SAVED,
                        savingSpot: false
                    }
                });
            })
            .then(() => {
                // once the placeId has been added to Firestore, get the data for that spot
                fetchSavedSpotsDetails([placeId])(dispatch);
            })
            .catch(error => {
                dispatch({
                    type: SAVE_SPOT,
                    payload: {
                        errorMsg: error.message,
                        savingSpot: false
                    }
                });
            })
    }
}


// removes the placeId from the user's Firestore array of saved spots, then 
// dispatches to remove the place data from redux store
export const removeSavedSpot = (placeId) => (dispatch) => {
    dispatch({
        type: REMOVE_SAVED_SPOT,
        payload: {
            removingSpot: true
        }
    });

    const firebase = getFirebase(); // connect to firebase
    const firestore = getFirebase().firestore();
    const user = firebase.auth().currentUser;

    if (!user) {
        // user isn't signed in
        dispatch({
            type: REMOVE_SAVED_SPOT,
            payload: {
                errorMsg: USER_NOT_SIGNED_IN,
                removingSpot: false
            }
        })
    } else {
        // user is signed in; save placeId to their spots and fetch details

        var userRef = firestore.collection("users").doc(user.uid.toString());

        // Atomically remove the placeId from the savedSpots array field.
        userRef.update({
            savedSpots: firebase.firestore.FieldValue.arrayRemove(placeId)
        })
            .then(() => {
                dispatch({
                    type: REMOVE_SAVED_SPOT,
                    payload: {
                        errorMsg: SPOT_REMOVED,
                        removingSpot: false,
                        placeId: placeId
                    }
                });
            })
            .catch(error => {
                dispatch({
                    type: REMOVE_SAVED_SPOT,
                    payload: {
                        errorMsg: error.message,
                        removingSpot: false
                    }
                });
            })
    }
}
