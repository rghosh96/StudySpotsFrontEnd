
// given some array of JSON
//     arr = [{ someKey: <any>, someValue: <any>, ... }, ...]
// returns a Map object with "someKey" keys and "someValue" values
export const mapify = (arr, keyAttr, valueAttr) => {
    let map = new Map();
    arr.forEach(a => {
        map.set(a[keyAttr], a[valueAttr]);
    });
    return map;
};

// given a map of key/value pairs and an array of keys, returns an array of ordered values
export const mapGetArray = (map, arr) => {
    arr.map(a => {
        return map.get(a);
    });
};

// takes an array of periods info returned from Google Places API.
// returns array of formatted open hours info (e.g. "Sunday 9:00am-5:00pm")
export const placesPeriodsReducer = (periods) => {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const formatTime = (hours, minutes) => {
        return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes.toString().padStart(2, '0')}${hours > 12 ? 'pm' : 'am'}`;
    };

    return periods.map(p => {
        return `${weekDays[p.open.day] + ' ' + formatTime(p.open.hours, p.open.minutes) + '-' + formatTime(p.close.hours, p.close.minutes)}`;
    });
};

// takes an array of photos info from Google Places API.
// returns an array of the relevant photo info
export const placesPhotosReducer = (photos) => {
    return photos.map(p => {
        return {
            url: p.getUrl(),
            height: p.height,
            width: p.width,
        };
    });
};

// takes an array of reviews info from Google Places API.
// returns an array of the relevant review info
export const placesReviewsReducer = (reviews) => {
    return reviews.map(r => {
        return {
            author: r.author_name,
            authorUrl: r.author_url,
            profilePicUrl: r.profile_photo_url,
            rating: r.rating,
            relativeTime: r.relative_time_description,
            text: r.text,
        }
    });
};

// takes an array of business types info from Google Places API.
// returns an array of formatted types (e.g. "grocery_store" becomes "Grocery Store")
export const placesTypesReducer = (types) => {
    return types.map(t => {
        // make first char uppercase
        let firstToUpper = t.slice(0,1).toUpperCase() + t.slice(1);
        
        // the first arg is a regex that matches "_C", where C is any lowercase alpha character
        // the second arg is a callback that returns " C.toUpperCase()"
        return firstToUpper.replaceAll(/_[a-z]{1}/g, s => {return ' ' + s.slice(1, 2).toUpperCase()});
    });
};