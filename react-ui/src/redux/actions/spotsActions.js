import { FETCH_SPOTS_REQUEST, FETCH_SPOTS_SUCCESS, FETCH_SPOTS_FAILURE,
    FETCH_SPOTS_CONSTANTS_SUCCESS, FETCH_SPOTS_CONSTANTS_FAILURE 
} from '../actions/types';
import { SPOT_CONSTANTS_ERROR } from '../errorMessages';
import { getFirebase } from 'react-redux-firebase';
import axios from "axios";
import { mockSpots } from '../mock-data/mockSpots';
import { mapify } from '../../helpers/dataStructureHelpers';


var businessStatusMap;
var languageMap;
var priceLevelMap;
var rankByMap;
var typeMap;


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


/*  (optional. these are params we can pass directly to a Place Search Request)
    queryParams: {
        keyword: <string>,   (phone number, address, name; pretty much anything)
        language: <enum>,    (language code: https://developers.google.com/maps/faq#languagesupport)
        types: [<enum>],     (enum list stored in our db, matching Google's types
        minprice: <number>,         NOTE: Place Search only allows one type. we will have to make mult requests to do this properly)
        maxprice: <number>,
        opennow: <boolean>,  (if true, only return places open now)
        rankby: <enum>,      (possible values: prominence (importance), distance (latter requires types or keyword))  
    }
*/
export const fetchSpots = (queryParams) => (dispatch) => {
    mockFetchSpots(queryParams)(dispatch);
};

export const fetchSpotsConstants = () => (dispatch) => {
    const firestore = getFirebase().firestore(); //connect to firebase

    firestore.collection('constants').doc("googlePlaces").get()
        .then(doc => {
            const constants = doc.data();

            businessStatusMap = mapify(constants.business_status, "display", "api");
            languageMap = mapify(constants.language, "display", "api");
            priceLevelMap = mapify(constants.price_level, "display", "api");
            rankByMap = mapify(constants.rankby, "display", "api");
            typeMap = mapify(constants.types, "display", "api");
            
            console.log(businessStatusMap);
            console.log(languageMap);
            console.log(priceLevelMap);
            console.log(rankByMap);
            console.log(typeMap);

            dispatch({
                type: FETCH_SPOTS_CONSTANTS_SUCCESS,
                payload: {
                    businessStatusConstants: Array.from(businessStatusMap.keys()),
                    languageConstants: Array.from(languageMap.keys()),
                    priceLevelConstants: Array.from(priceLevelMap.keys()),
                    rankByConstants: Array.from(rankByMap.keys()),
                    typeConstants: Array.from(typeMap.keys()),
                }
            });
        })
        .catch(error => {
            dispatch({
                type: FETCH_SPOTS_CONSTANTS_FAILURE,
                payload: SPOT_CONSTANTS_ERROR
            });
        });
};

const wait = time => new Promise((resolve) => setTimeout(resolve, time));

export const mockFetchSpots = (queryParams) => (dispatch) => {
    dispatch({ type: FETCH_SPOTS_REQUEST });

    wait(2000)
        .then(() => {
            console.log(mockSpots[0])

            dispatch({
                type: FETCH_SPOTS_SUCCESS,
                payload: mockSpots
            });
        })

    return;


    // used for generating data from fakeJSON api
    let payload = {
        token: process.env.REACT_APP_FAKEJSON_API_TOKEN,
        data: {
            name: "companyName",
            business_status: "numberInt|0,2",           // 0: OPERATIONAL, 1: CLOSED_TEMPORARILY, 3: CLOSED_PERMANENTLY
            types: "functionArray|1,5|numberInt|0,9",   // array of 1-5 numbers valued 0-9, an enum type of business
            formatted_address: "addressFullStreet",
            formatted_phone_number: "phoneHome",
            opening_hours: {
                open_now: "numberBool",
                periods: {
                    open: {
                        day: "numberInt|0,6",        // enum day of the week
                        time: "dateTime|ISOtime"
                    },
                    close: {  // may be null/missing
                        day: "numberInt|0,6",
                        time: "dateTime|ISOtime"
                    },
                    _repeat: 7
                },
                weekday_text: "stringWords",
            },
            rating: "numberFloat|1,5|1",    // 1.0-5.0 stars
            reviews: {
                author_name: "name",
                author_url: "internetUrl",
                profile_photo_url: "internetUrl",
                // language ?
                rating: "numberInt|1,5",
                relative_time_description: "dateTime",
                text: "stringWords",
                date: "date:ISO:Basic",
                _repeat: 3
            },
            price_level: "numberInt|0,4",   // 0-4 least to most expensive
            url: "internetUrl",             // Google page url
            website: "internetUrl",         // definitive url for the business
            _repeat: 5
        }
    };

    axios({
        method: "post",
        url: "https://app.fakejson.com/q",
        data: payload
    }).then(response => {
        dispatch({
            type: FETCH_SPOTS_SUCCESS,
            payload: response.data
        });
    }).catch(err => {
        dispatch({
            type: FETCH_SPOTS_FAILURE,
            payload: err.message
        })
    })
}