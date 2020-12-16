// adapted from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
// returns Euclidean distance or "as the crow flies" distance, in miles, 
// with respect to the curvature of the Earth (not driving distance!)
export const euclidDistance = (fromLat, fromLong, toLat, toLong) => {
    var R = 6371; // radius of the Earth in km
    var distLat = degToRad(toLat-fromLat);
    var distLong = degToRad(toLong-fromLong);
    fromLat = degToRad(fromLat);
    toLat = degToRad(toLat);

    var a = Math.sin(distLat/2) * Math.sin(distLat/2) +
    Math.sin(distLong/2) * Math.sin(distLong/2) * Math.cos(fromLat) * Math.cos(toLat); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = kmToMi(R * c);

    return d.toFixed(1);
}

// Converts numeric degrees to radians
const degToRad = (val) => {
    return val * Math.PI / 180;
}

// converts kilometers to miles
const kmToMi = (km) => {
    return km * 0.621371;
}

// from https://stackoverflow.com/questions/7342957/how-do-you-round-to-1-decimal-place-in-javascript
// round(12345.6789, 2) returns 12345.68
// round(12345.6789, 1) returns 12345.7
// round(12345.6789) returns 12346
// round(12345, 1) returns 12346
export const round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

