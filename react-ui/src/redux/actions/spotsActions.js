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
    SAVE_SPOT, REMOVE_SAVED_SPOT, FETCH_SAVED_SPOTS_DETAILS,
    SUBMIT_RATING
} from '../actions/types';
import {
    SUCCESS, SPOT_CONSTANTS_ERROR, USER_DENIED_LOCATION,
    SPOT_SAVED, SPOT_REMOVED, MISSING_PLACE_IDS, STATUS_UNAVAILABLE, INVALID_ARGS
} from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import {
    mapify, mapGetArray, placesPeriodsReducer, placesPhotosReducer, placesReviewsReducer, placesTypesReducer
} from '../../helpers/dataStructureHelpers';
import { euclidDistance } from '../../helpers/distanceCalculator';
import popularTimes from '../../services/popularTimes';
import {
    getUserId, setDocumentData, getDocumentData, getNestedDocumentData, setNestedDocumentData, appendToDocArray, removeFromDocArray
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

const NEARBY_SEARCH_RADIUS = 1500; // in meters (about 6 miles). max is 50000


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
                                                try {
                                                    if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                                                        let popTimes = await popularTimes(await results.url);
                                                        let distance = euclidDistance(latitude, longitude, r.geometry.location.lat(), r.geometry.location.lng());
                                                        let types = typesMap && r.types ? mapGetArray(typesMap, r.types) : (r.types ? r.types : []);

                                                        let spot = {
                                                            placeId: r.place_id,
                                                            name: r.name,
                                                            businessStatus: businessStatusMap ? businessStatusMap.get(r.business_status) : STATUS_UNAVAILABLE,
                                                            iconUrl: r.icon || null,
                                                            vicinity: r.vicinity || null, // almost always an address
                                                            distance: distance,
                                                            photos: placesPhotosReducer(r.photos),
                                                            types: types,
                                                            rating: r.rating || null,
                                                            userRatingsTotal: r.user_ratings_total || null,
                                                            url: results.url || null,
                                                            openNow: r.opening_hours ? r.opening_hours.isOpen() : null,
                                                            popularTimes: await popTimes,
                                                        };

                                                        resolve(await spot);
                                                    } else {
                                                        throw new Error(placesRequestStatusMap ? placesRequestStatusMap.get(status) : SPOT_CONSTANTS_ERROR);
                                                    }
                                                } catch (error) {
                                                    dispatch({
                                                        type: FETCH_SPOTS_FAILURE,
                                                        payload: error.message
                                                    });
                                                }
                                            }
                                        );
                                    })
                                        // add the aggregate ratings to the spot details
                                        .then(async spot => {
                                            const data = await getDocumentData("spots", spot.placeId);

                                            var newSpot = {
                                                ...spot,
                                                studySpotsRatings: {
                                                    numRatings: data == null ? null : data.numRatings,
                                                    overall: data == null ? null : data.avgOverallRating,
                                                    lighting: data == null ? null : data.avgLightingRating,
                                                    music: data == null ? null : data.avgMusicRating,
                                                    food: data == null ? null : data.avgFoodRating,
                                                    drink: data == null ? null : data.avgDrinkRating,
                                                }
                                            };

                                            return await newSpot;
                                        });
                                }))
                                    .then(async spots => {
                                        dispatch({
                                            type: FETCH_SPOTS_SUCCESS,
                                            payload: await spots
                                        });
                                    })
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
                                drink: data && data.avgDrinkRating ? data.avgDrinkRating : null,
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
                                        let types = typesMap && results.types ? mapGetArray(typesMap, results.types) : (results.types ? results.types : []);

                                        // createMarker(place); // for usage with map
                                        let spotDetails = {
                                            placeId: results.place_id,
                                            name: results.name,
                                            businessStatus: businessStatusMap.get(results.business_status),
                                            distance: distance || null,
                                            formattedAddress: results.formatted_address,
                                            formattedPhoneNumber: results.formatted_phone_number,
                                            iconUrl: results.icon || null,
                                            types: types,
                                            openNow: results.opening_hours.isOpen(),
                                            openHours: placesPeriodsReducer(results.opening_hours.periods),
                                            popularTimes: await popTimes,
                                            photos: placesPhotosReducer(results.photos),
                                            priceLevel: priceLevelMap.get(results.price_level),
                                            rating: results.rating || null,
                                            reviews: placesReviewsReducer(results.reviews),
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

    getUserId()
        .then(userId => {
            return appendToDocArray("users", userId, "savedSpots", placeId)
        })
        .then(docRef => {
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
        });
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

    getUserId()
        .then(userId => {
            return removeFromDocArray("users", userId, "savedSpots", placeId);
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
        });
}

/* rating = {
    overall: <string '1'-'5'>,
    food: <string '1'-'5'>,
    drink: <string '1'-'5'>,
    music: <string '1'-'5'>,
    lighting: <string '1'-'5'>    
} */
export const submitRating = (placeId, rating) => async (dispatch) => {
    // parse all args to int
    const formattedRating = {
        overall: parseInt(rating.overall),
        lighting: parseInt(rating.lighting),
        music: parseInt(rating.music),
        food: parseInt(rating.food),
        drink: parseInt(rating.drink),
    }

    // make sure rating data is legal before proceeding
    for (const [key, value] of Object.entries(formattedRating)) {
        if (isNaN(value) || value < 1 || value > 5) {
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

    const userId = await getUserId();
    const oldRatingsAgg = await getDocumentData("spots", placeId);
    var newRatingsAgg = {};

    // start by retieving existing rating from this user (if any)
    getNestedDocumentData("spots", placeId, "ratings", userId)
        .then(existingRating => {

            // case where no users have ever rated this spot
            if (oldRatingsAgg == null) {
                newRatingsAgg = {
                    numRatings: 1,
                    avgOverallRating: formattedRating.overall,
                    avgMusicRating: formattedRating.music,
                    avgLightingRating: formattedRating.lighting,
                    avgDrinkRating: formattedRating.drink,
                    avgFoodRating: formattedRating.food,
                };
            }

            // case where 1 or more users have rated this spot, but not the signed-in user
            else if (existingRating == null) {
                const { numRatings, avgOverallRating, avgMusicRating, avgLightingRating, avgDrinkRating, avgFoodRating } = oldRatingsAgg;

                let newNumRatings = numRatings + 1;
                newRatingsAgg = {
                    numRatings: newNumRatings,
                    avgOverallRating: ((avgOverallRating * numRatings) + formattedRating.overall) / newNumRatings,
                    avgMusicRating: ((avgMusicRating * numRatings) + formattedRating.lighting) / newNumRatings,
                    avgLightingRating: ((avgLightingRating * numRatings) + formattedRating.music) / newNumRatings,
                    avgDrinkRating: ((avgDrinkRating * numRatings) + formattedRating.food) / newNumRatings,
                    avgFoodRating: ((avgFoodRating * numRatings) + formattedRating.drink) / newNumRatings,
                }
            }

            // case where this user has rated the spot in the past
            else if (existingRating != null) {
                const { numRatings, avgOverallRating, avgMusicRating, avgLightingRating, avgDrinkRating, avgFoodRating } = oldRatingsAgg;

                newRatingsAgg = {
                    numRatings: numRatings,
                    avgOverallRating: ((avgOverallRating * numRatings) + formattedRating.overall - existingRating.overall) / numRatings,
                    avgMusicRating: ((avgMusicRating * numRatings) + formattedRating.lighting - existingRating.lighting) / numRatings,
                    avgLightingRating: ((avgLightingRating * numRatings) + formattedRating.music - existingRating.music) / numRatings,
                    avgDrinkRating: ((avgDrinkRating * numRatings) + formattedRating.food - existingRating.food) / numRatings,
                    avgFoodRating: ((avgFoodRating * numRatings) + formattedRating.drink - existingRating.drink) / numRatings,
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
}
