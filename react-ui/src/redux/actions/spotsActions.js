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
    FETCH_SAVED_SPOTS_DETAILS,
    SUBMIT_RATING, CLEAR_ACTIVE_SPOT,
    CREATE_COMMENT, DELETE_COMMENT, UPDATE_COMMENT, FETCH_COMMENTS_SUCCESS, FETCH_COMMENTS_FAILURE, FETCH_COMMENTS_REQUEST
} from '../actions/types';
import {
    SUCCESS, SPOT_CONSTANTS_ERROR, USER_DENIED_LOCATION,
    MISSING_PLACE_IDS, STATUS_UNAVAILABLE, INVALID_ARGS, USER_NOT_SIGNED_IN
} from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import {
    mapify, mapGetArray, placesPeriodsReducer, placesPhotosReducer, placesReviewsReducer, placesTypesReducer
} from '../../helpers/dataStructureHelpers';
import { euclidDistance } from '../../helpers/distanceCalculator';
import popularTimes from '../../services/popularTimes';
import {
    getUserId, setDocumentData, getDocumentData, getNestedDocumentData, setNestedDocumentData, appendToDocArray, removeFromDocArray, removeDocFromNestedDocArray, addAmbiguousDoc, getNestedCollectionData
} from '../../services/firebaseService';


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

const NEARBY_SEARCH_RADIUS = 50000; // in meters (about 6 miles). max is 50000


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

                    var searchParams = {
                        location: here,
                        // this weird syntax means include the object attribute only if ...(condition) is true
                        ...(params.rankBy) && { rankBy: params.rankBy },
                        ...(!params.rankBy || params.rankBy !== "1") && { radius: NEARBY_SEARCH_RADIUS },
                        ...(params.type) && { type: params.type },
                        ...(params.language) && { language: params.language },
                        ...(params.keyword) && { keyword: params.keyword },
                        ...(params.openNow) && { openNow: params.openNow },
                        ...(params.minPriceLevel) && { minPriceLevel: params.minPriceLevel },
                        ...(params.maxPriceLevel) && { maxPriceLevel: params.maxPriceLevel },
                        ...(params.pageToken) && { pageToken: params.pageToken },
                    };

                    // use map from above instead of createElement to integrate Google maps 
                    var service = new window.google.maps.places.PlacesService(document.createElement('div')); // a dummy element
                    service.nearbySearch(
                        // request params
                        searchParams,

                        // callback to handle response/errors
                        async (results, status) => {
                            if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                                // use for maps integration
                                // for (var i = 0; i < results.length; i++) {
                                //     createMarker(results[i]);
                                // }

                                var spots = results.map(r => {
                                    let distance = euclidDistance(latitude, longitude, r.geometry.location.lat(), r.geometry.location.lng());

                                    return {
                                        placeId: r.place_id,
                                        name: r.name,
                                        businessStatus: businessStatusMap ? businessStatusMap.get(r.business_status) : STATUS_UNAVAILABLE,
                                        iconUrl: r.icon || null,
                                        vicinity: r.vicinity || null, // almost always an address
                                        distance: distance,
                                        photos: r.photos ? placesPhotosReducer(r.photos) : null,
                                        types: r.types ? placesTypesReducer(r.types) : null,
                                        rating: r.rating || null,
                                        userRatingsTotal: r.user_ratings_total || null,
                                        openNow: r.opening_hours ? r.opening_hours.open_now : null
                                    };
                                });

                                dispatch({
                                    type: FETCH_SPOTS_SUCCESS,
                                    payload: await spots
                                });

                            } else {
                                dispatch({
                                    type: FETCH_SPOTS_FAILURE,
                                    payload: placesRequestStatusMap ? placesRequestStatusMap.get(status) : SPOT_CONSTANTS_ERROR
                                });
                            }
                        }
                    );
                } else {
                    dispatch({
                        type: FETCH_SPOTS_FAILURE,
                        payload: USER_DENIED_LOCATION
                    });
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
    try {
        // this will force a browser popup that asks permission to use the user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                if (latitude && longitude) {
                    // try getting ratings data
                    getDocumentData("spots", placeId)
                        .then(data => {
                            var studySpotsRatings = {
                                numRatings: data && data.numRatings ? data.numRatings : null,
                                overall: data && data.avgOverallRating ? data.avgOverallRating : null,
                                lighting: data && data.avgLightingRating ? data.avgLightingRating : null,
                                music: data && data.avgMusicRating ? data.avgMusicRating : null,
                                food: data && data.avgFoodRating ? data.avgFoodRating : null,
                                space: data && data.avgSpaceRating ? data.avgSpaceRating : null,
                            }

                            // now get the rest of spot details from Places API
                            var service = new window.google.maps.places.PlacesService(document.createElement('div'));

                            service.getDetails(
                                {
                                    placeId: placeId,
                                    // return only the fields specified
                                    fields: [
                                        "place_id",
                                        "name",
                                        "business_status",
                                        "geometry",
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
                                        let distance = euclidDistance(latitude, longitude, results.geometry.location.lat(), results.geometry.location.lng());

                                        // createMarker(place); // for usage with map
                                        let spotDetails = {
                                            placeId: results.place_id,
                                            name: results.name,
                                            businessStatus: businessStatusMap.get(results.business_status),
                                            distance: distance || null,
                                            formattedAddress: results.formatted_address,
                                            formattedPhoneNumber: results.formatted_phone_number,
                                            iconUrl: results.icon || null,
                                            types: results.types ? placesTypesReducer(results.types) : null,
                                            openNow: results.opening_hours ? results.opening_hours.open_now : null,
                                            openHours: results.opening_hours ? placesPeriodsReducer(results.opening_hours.periods) : null,
                                            popularTimes: await popTimes,
                                            photos: results.photos ? placesPhotosReducer(results.photos) : null,
                                            priceLevel: priceLevelMap.get(results.price_level),
                                            rating: results.rating || null,
                                            reviews: results.reviews ? placesReviewsReducer(results.reviews) : null,
                                            studySpotsRatings: studySpotsRatings,
                                        }

                                        onSuccess(spotDetails);
                                    } else {
                                        onFailure(status);
                                    }
                                }
                            );
                        })
                        .catch(error => {
                            onFailure(error.message);
                        });
                } else {
                    onFailure(USER_DENIED_LOCATION);
                }
            }
        );
    } catch (error) {
        onFailure(error.message);
    }
}


// calls fetchAPISpotDetails with the appropriate dispatches
export const fetchSpotDetails = (placeId) => dispatch => {
    console.log("FETCHING SPOT DETAILS")
    dispatch({
        type: FETCH_SPOT_DETAILS,
        payload: {
            fetchingSpots: true,
            spotsFetched: false,
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
                spotsFetched: false,
                errorMsg: errorMsg
            }
        });
    }

    fetchAPISpotDetails(placeId, onSuccess, onFailure);
}

export const clearActiveSpot = () => dispatch => {
    dispatch({
        type: CLEAR_ACTIVE_SPOT
    })
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

/* rating = {
    overall: <string '1'-'5'>,
    food: <string '1'-'5'>,
    space: <string '1'-'5'>,
    music: <string '1'-'5'>,
    lighting: <string '1'-'5'>    
} */
export const submitRating = (placeId, rating) => async (dispatch) => {
    // parse all args to int
    console.log("IN SUBMIT RATING REDUX")
    console.log(placeId)
    console.log(rating)
    var formattedRating = {
        overall: rating.overall ? parseInt(rating.overall) : null,
        music: rating.music ? parseInt(rating.music) : null,
        lighting: rating.lighting ? parseInt(rating.lighting) : null,
        space: rating.space ? parseInt(rating.space) : null,
        food: rating.food ? parseInt(rating.food) : null,
    }

    // make sure rating data is legal before proceeding
    for (const [key, value] of Object.entries(formattedRating)) {
        if (value && (isNaN(value) || value < 1 || value > 5)) {
            dispatch({
                type: SUBMIT_RATING,
                payload: {
                    submittingRating: false,
                    errorMsg: INVALID_ARGS
                }
            });
            return;
        }
    }

    dispatch({
        type: SUBMIT_RATING,
        payload: {
            submittingRating: true
        }
    });

    try {

    const userId = await getUserId();
    const oldRatingsAgg = await getDocumentData("spots", placeId);
    var newRatingsAgg = {};

        // start by retieving existing rating from this user (if any)
        getNestedDocumentData("spots", placeId, "ratings", userId)
            .then(existingRating => {
                // case where no users have ever rated this spot
                if (oldRatingsAgg == null) {
                    console.log("no one has rated")

                    newRatingsAgg = {
                        numOverallRatings: formattedRating.overall ? 1 : 0,
                        numMusicRatings: formattedRating.music ? 1 : 0,
                        numLightingRatings: formattedRating.lighting ? 1 : 0,
                        numSpaceRatings: formattedRating.space ? 1 : 0,
                        numFoodRatings: formattedRating.food ? 1 : 0,
                        avgOverallRating: formattedRating.overall ? formattedRating.overall : null,
                        avgMusicRating: formattedRating.music ? formattedRating.music : null,
                        avgLightingRating: formattedRating.lighting ? formattedRating.lighting : null,
                        avgSpaceRating: formattedRating.space ? formattedRating.space : null,
                        avgFoodRating: formattedRating.food ? formattedRating.food : null,
                    };
                }

                // case where 1 or more users have rated this spot, but not the signed-in user
                else if (existingRating == null) {
                    const { numOverallRatings, numMusicRatings, numLightingRatings, numSpaceRatings, numFoodRatings, avgOverallRating, avgMusicRating, avgLightingRating, avgSpaceRating, avgFoodRating } = oldRatingsAgg;

                    // only add 1 if user submitted a rating for that category
                    let newNumOverallRatings = formattedRating.overall ? numOverallRatings + 1 : numOverallRatings;
                    let newNumMusicRatings = formattedRating.music ? numMusicRatings + 1 : numMusicRatings;
                    let newNumLightingRatings = formattedRating.lighting ? numLightingRatings + 1 : numLightingRatings;
                    let newNumSpaceRatings = formattedRating.space ? numSpaceRatings + 1 : numSpaceRatings;
                    let newNumFoodRatings = formattedRating.food ? numFoodRatings + 1 : numFoodRatings;

                    let newAvgOverallRatings = avgOverallRating ? ((avgOverallRating * numOverallRatings) + formattedRating.overall) / newNumOverallRatings : null;
                    let newAvgMusicRatings = avgMusicRating ? ((avgMusicRating * numMusicRatings) + formattedRating.music) / newNumMusicRatings : null;
                    let newAvgLightingRatings = avgLightingRating ? ((avgLightingRating * numLightingRatings) + formattedRating.lighting) / newNumLightingRatings : null;
                    let newAvgSpaceRatings = avgSpaceRating ? ((avgSpaceRating * numSpaceRatings) + formattedRating.space) / newNumSpaceRatings : null;
                    let newAvgFoodRatings = avgFoodRating ? ((avgFoodRating * numFoodRatings) + formattedRating.food) / newNumFoodRatings : null;

                    newRatingsAgg = {
                        numOverallRatings: newNumOverallRatings,
                        numMusicRatings: newNumMusicRatings,
                        numLightingRatings: newNumLightingRatings,
                        numSpaceRatings: newNumSpaceRatings,
                        numFoodRatings: newNumFoodRatings,
                        avgOverallRating: newAvgOverallRatings || (formattedRating.overall ? formattedRating.overall : null),
                        avgMusicRating: newAvgMusicRatings || (formattedRating.music ? formattedRating.music : null),
                        avgLightingRating: newAvgLightingRatings || (formattedRating.lighting ? formattedRating.lighting : null),
                        avgSpaceRating: newAvgSpaceRatings || (formattedRating.space ? formattedRating.space : null),
                        avgFoodRating: newAvgFoodRatings || (formattedRating.food ? formattedRating.food : null),
                    }

                }

                // case where this user has rated the spot in the past
                else {
                    const { numOverallRatings, numMusicRatings, numLightingRatings, numSpaceRatings, numFoodRatings, avgOverallRating, avgMusicRating, avgLightingRating, avgSpaceRating, avgFoodRating } = oldRatingsAgg;
                    const { overall, music, lighting, space, food } = existingRating;
                    formattedRating = {
                        overall: formattedRating.overall || overall,
                        music: formattedRating.music || music,
                        lighting: formattedRating.lighting || lighting,
                        space: formattedRating.space || space,
                        food: formattedRating.food || food,
                    }

                    // only add 1 if no rating exist for that category for this user
                    let newNumOverallRatings = formattedRating.overall && !overall ? numOverallRatings + 1 : numOverallRatings;
                    let newNumMusicRatings = formattedRating.music && !music ? numMusicRatings + 1 : numMusicRatings;
                    let newNumLightingRatings = formattedRating.lighting && !lighting ? numLightingRatings + 1 : numLightingRatings;
                    let newNumSpaceRatings = formattedRating.space && !space ? numSpaceRatings + 1 : numSpaceRatings;
                    let newNumFoodRatings = formattedRating.food && !food ? numFoodRatings + 1 : numFoodRatings;

                    let newAvgOverallRatings = avgOverallRating ? ((avgOverallRating * numOverallRatings) + formattedRating.overall - overall) / newNumOverallRatings : null;
                    let newAvgMusicRatings = avgMusicRating ? ((avgMusicRating * numMusicRatings) + formattedRating.music - music) / newNumMusicRatings : null;
                    let newAvgLightingRatings = avgLightingRating ? ((avgLightingRating * numLightingRatings) + formattedRating.lighting - lighting) / newNumLightingRatings : null;
                    let newAvgSpaceRatings = avgSpaceRating ? ((avgSpaceRating * numSpaceRatings) + formattedRating.space - space) / newNumSpaceRatings : null;
                    let newAvgFoodRatings = avgFoodRating ? ((avgFoodRating * numFoodRatings) + formattedRating.food - food) / newNumFoodRatings : null;

                    newRatingsAgg = {
                        numOverallRatings: newNumOverallRatings,
                        numMusicRatings: newNumMusicRatings,
                        numLightingRatings: newNumLightingRatings,
                        numSpaceRatings: newNumSpaceRatings,
                        numFoodRatings: newNumFoodRatings,
                        avgOverallRating: newAvgOverallRatings || (formattedRating.overall ? formattedRating.overall : null),
                        avgMusicRating: newAvgMusicRatings || (formattedRating.music ? formattedRating.music : null),
                        avgLightingRating: newAvgLightingRatings || (formattedRating.lighting ? formattedRating.lighting : null),
                        avgSpaceRating: newAvgSpaceRatings || (formattedRating.space ? formattedRating.space : null),
                        avgFoodRating: newAvgFoodRatings || (formattedRating.food ? formattedRating.food : null),
                    };
                }

                // set the new aggregate ratings fields
                return setDocumentData("spots", placeId, newRatingsAgg);
            })
            .then(() => {
                // update the user's rating
                return setNestedDocumentData("spots", placeId, "ratings", userId, formattedRating);
            })
            .catch(error => {
                dispatch({
                    type: SUBMIT_RATING,
                    payload: {
                        submittingRating: false,
                        errorMsg: error.message
                    }
                });
            });
    } catch (error) {
        dispatch({
            type: SUBMIT_RATING,
            payload: {
                submittingRating: false,
                errorMsg: error.message
            }
        });
    }
}

export const createComment = (placeId, text) => async (dispatch) => {


    dispatch({
        type: CREATE_COMMENT,
        payload: {
            creatingComment: true
        }
    })

    const userId = await getUserId();

    getDocumentData("users", userId)
        .then(userData => {

            const fname = userData['fName'];
            const lname = userData['lName'];

            const newComment = {
                fname: fname,
                lname: lname,
                userId: userId,
                comment: text,
                timestamp: new Date(),

            }

            if (isNaN(newComment.comment.length) || newComment.comment.length < 1 || newComment.comment.length > 280) {
                dispatch({
                    type: CREATE_COMMENT,
                    payload: {
                        creatingComment: false,
                        errorMsg: INVALID_ARGS
                    }
                });
                return;
            }

            addAmbiguousDoc("spots", placeId, "comments")
                .then(commentDoc => {
                    setNestedDocumentData("spots", placeId, "comments", commentDoc.id, newComment)
                })
                .catch(error => {
                    dispatch({
                        type: CREATE_COMMENT,
                        payload: {
                            creatingComment: false,
                            errorMsg: error.message
                        }
                    })
                })

        })


}

export const deleteComment = (placeId, commentId) => (dispatch) => {

    dispatch({
        type: DELETE_COMMENT,
        payload: {
            deletingComment: true
        }
    })

    removeDocFromNestedDocArray("spots", placeId, "comments", commentId)
        .catch(error => {
            dispatch({
                type: DELETE_COMMENT,
                payload: {
                    deletingComment: false,
                    errorMsg: error.message
                }
            })
        })


}

export const updateComment = (placeId, commentId, newtext) => async (dispatch) => {

    dispatch({
        type: UPDATE_COMMENT,
        payload: {
            updatingComment: true
        }
    })

    const userId = await getUserId();

    getDocumentData("users", userId)
        .then(userData => {

            const fname = userData['fName'];
            const lname = userData['lName'];

            const newComment = {
                fname: fname,
                lname: lname,
                userId: userId,
                comment: newtext,
                timestamp: new Date(),

            }

            if (isNaN(newComment.comment.length) || newComment.comment.length < 1 || newComment.comment.length > 280) {
                dispatch({
                    type: CREATE_COMMENT,
                    payload: {
                        creatingComment: false,
                        errorMsg: INVALID_ARGS
                    }
                });
                return;
            }

            setNestedDocumentData("spots", placeId, "comments", commentId, newComment)
                .catch(error => {
                    dispatch({
                        type: UPDATE_COMMENT,
                        payload: {
                            updatingComment: false,
                            payload: error.message
                        }
                    })
                })

        })

    // const newComment = {
    //     comment: newtext,
    //     timestamp: new Date(),
    //     userId: userId
    // }

    // if (isNaN(newComment.comment.length) || newComment.comment.length < 1 || newComment.comment.length > 280) {
    //     dispatch({
    //         type: UPDATE_COMMENT,
    //         payload: {
    //             updatingComment: false,
    //             errorMsg: INVALID_ARGS
    //         }
    //     });
    //     return;
    // }

}

export const fetchComments = (placeId) => (dispatch) => {
    dispatch({
        //request
        type: FETCH_COMMENTS_REQUEST,
        payload: {
            fetchingComments: true
        }
    })

    getNestedCollectionData("spots", placeId, "comments")
        .then(commentDetails => {

            dispatch({
                //success
                type: FETCH_COMMENTS_SUCCESS,
                commentDetails: commentDetails,
                fetchingComments: false,
                commentsFetched: true,
            })

        })
        .catch(error => {
            dispatch({

                type: FETCH_COMMENTS_FAILURE,
                fetchingComments: false,
                payload: error.message,
            })
        })

}



