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
	SAVE_SPOT, REMOVE_SAVED_SPOT, FETCH_SAVED_SPOTS
} from '../actions/types';
import { 
    INTERNAL_SERVER, SPOT_CONSTANTS_ERROR, USER_DENIED_LOCATION, USER_NOT_SIGNED_IN
} from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import axios from "axios";
import { mockSpots } from '../mock-data/mockSpots';
import { mapify, mapGetArray } from '../../helpers/dataStructureHelpers';

// these maps are used to turn enums returned by api calls into text that can
// be displayed to the user (the values from Firestore). 
// see helpers.dataStructureHelpers.mapify() and fetchSpotsConstants()
//
// example: businessStatusMapMap.get(response.business_status) 
// returns "Temporarily closed" when response.business_status === "TEMPORARILY_CLOSED"
var placesRequestStatusMap = undefined;
var businessStatusMap = undefined;
var typesMap = undefined;

const PLACES_NEARBY_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
const NEARBY_SEARCH_RADIUS = 10000; // in meters (about 6 miles). max is 50000

/*  (optional. these are params we can pass directly to a Place Search Request)
    params: {
        keyword: <string>,   (phone number, address, name; pretty much anything)
        language: constants.display,    (language code: https://developers.google.com/maps/faq#languagesupport)
        type: constants.display,     (enum list stored in our db, matching Google's types
        minprice: <number>,         NOTE: Place Search only allows one type. we will have to make mult requests to do this properly)
        maxprice: <number>,
        opennow: <boolean>,  (if true, only return places open now)
        rankby: constants.display,      (possible values: prominence (importance), distance (latter requires types or keyword))  
    }
*/
export const fetchNearbySpots = (params) => (dispatch) => {
    dispatch({ type: FETCH_SPOTS_REQUEST });

    // this will force a browser popup that asks permission to use the user's location
    navigator.geolocation.getCurrentPosition(
        function (position) {
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
                        opennow: params.opennow || null,
                        rankby: params.rankby || null,
                        pagetoken: params.pagetoken || null,
                    },

                    // callback to handle response/errors
                    (results, status) => {
                        if (status == window.google.maps.places.PlacesServiceStatus.OK) {
                            // use for maps integration
                            // for (var i = 0; i < results.length; i++) {
                            //     createMarker(results[i]);
                            // }

                            let data = results.map(r => {
                                return {
                                    placeId: r.place_id,
                                    name: r.name,
                                    businessStatus: businessStatusMap ? businessStatusMap.get(r.business_status) : '',
                                    iconUrl: r.icon,
                                    opennow: r.opening_hours ? r.opening_hours.open_now : null,
                                    vicinity: r.vicinity, // almost always an address
                                    photos: r.photos, // [{ height, premade html element, width }]
                                    types: typesMap && r.types ? mapGetArray(typesMap, r.types) : [],
                                    rating: r.rating,
                                    userRatingsTotal: r.user_ratings_total
                                }
                            })

                            dispatch({
                                type: FETCH_SPOTS_SUCCESS,
                                payload: data
                            })
                        } else {
                            dispatch({
                                type: FETCH_SPOTS_FAILURE,
                                payload: placesRequestStatusMap ? 
                                    placesRequestStatusMap.get(status) : INTERNAL_SERVER
                            })
                        }
                    }
                );                
            } else {
                dispatch({
                    type: FETCH_SPOTS_FAILURE,
                    payload: USER_DENIED_LOCATION
                })
            }
        }
    );
};

export const fetchSpotsConstants = () => (dispatch) => {
    const firestore = getFirebase().firestore(); //connect to firebase

    firestore.collection('constants').doc("googlePlaces").get()
        .then(doc => {
            const constants = doc.data();

            businessStatusMap = mapify(constants.business_status, "api", "display");
            typesMap = mapify(constants.types, "api", "display");
            placesRequestStatusMap = mapify(constants.status, "api", "display");

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

// if no placeId, fetches data for all the user's saved spots and passes it to reducer
// else fetches the data for the placeId that was passed (similar to spotActions.fetchSpotDetails)
export const fetchedSavedSpots = (placeId = null) => (dispatch) => {

}

// adds placeId to the current user's savedSpots in Firestore, then calls 
// spotsActions.fetchSpotDetails(), and the details are passed into the reducer
// to create a new entry in the redux savedSpots Map
export const saveSpot = (placeId) => (dispatch) => {
    dispatch({
        type: SAVE_SPOT,
		payload: {
            errorMsg: '',
			savingSpot: true
		}
	});
    
	const firebase = getFirebase(); // connect to firebase
	const firestore = getFirebase().firestore();
	const user = firebase.auth().currentUser;
    
	// user isn't signed in
	if (!user) {
        dispatch({
            type: SAVE_SPOT,
			payload: {
                errorMsg: USER_NOT_SIGNED_IN,
				savingSpot: false
			}
		})
        // user is signed in; save to their spots and fetch details
	} else {
        var userRef = firestore.collection("users").doc(user.uid.toString());
        
		// Atomically add a new placeId to the savedSpots array field.
		userRef.update({
            savedSpots: firebase.firestore.FieldValue.arrayUnion(placeId)
		}).then(() => {
            
        }).catch(error => {
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

// removes the placeId from the user's Firestore array of saved spots
export const removeSavedSpot = (placeId) => (dispatch) => {

} 
