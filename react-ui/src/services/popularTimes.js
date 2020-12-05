// adapted from source code at https://github.com/rak-trzustki/busy-hours/blob/master/src/index.js

const popularTimes = async (placeUrl) => {
    console.log(placeUrl)
    let resp = await fetch('/poptimes?placeUrl=' + placeUrl);
    let json = await resp.json();

    return {
        status: json.popularTimes ? json.popularTimes.status : json.status,
        message: json.message,
        week: json.popularTimes ? json.popularTimes.week : undefined
    }
};

export default popularTimes;