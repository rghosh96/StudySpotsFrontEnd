// adapted from source code at https://github.com/rak-trzustki/busy-hours/blob/master/src/index.js

const popularTimes = async (placeUrl) => {
    if (!(placeUrl)) {
        return { status: 'error', message: 'Place URL missing' };
    }

    try {
        const html = await fetch_html(placeUrl);
        return Object.assign(process_html(html));
    } catch (err) {
        return { status: 'error', message: 'Error: ' + err.message || err };
    }
};

const format_output = array => {
    return {
        hour: array[0],
        percentage: array[1]
    }
};

const extract_data = async html => {

    let str = ['APP_INITIALIZATION_STATE=', 'window.APP_FLAGS']
    let script = html.substring(html.lastIndexOf(str[0]) + str[0].length, html.lastIndexOf(str[1]));

    let first = eval(script)
    let second = eval(first[3][6].replace(")]}'", ""));

    return second[6][84];
};

const process_html = async html => {
    const popular_times = await extract_data(html);

    if (!popular_times) {
        return { status: 'error', message: 'Place has no popular hours' };
    }

    const data = { status: 'ok' };
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    data.week = Array.from(Array(7).keys()).map(index => {
        let hours = [];
        if (popular_times[0][index] && popular_times[0][index][1]) {
            hours = Array.from(popular_times[0][index][1]).map(array => format_output(array));
        }
        return {
            day: weekdays[index],
            hours: hours
        };
    });
    const crowded_now = popular_times[7];

    if (crowded_now !== undefined) {
        data.now = format_output(crowded_now);
    }
    return data;

};

const fetch_html = async (url) => {
    try {
        // some kind soul has built this server that lets us bypass the no 
        // Access-Control-Allow-Origin error recieved from a plain ol' fetch
        const proxyUrl = "https://cors-anywhere.herokuapp.com/";

        var headers = new Headers({
            'Content-Type': 'text/html; charset=UTF-8',
            'Access-Control-Allow-Headers': '*'
        });

        const html = await fetch(proxyUrl + url, {
            method: 'GET',
        });

        return html.text();
    }
    catch (err) {
        return { status: 'error', message: 'Invalid url' };
    }
};

export default popularTimes;