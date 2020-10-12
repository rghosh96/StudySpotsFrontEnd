
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
    })
}