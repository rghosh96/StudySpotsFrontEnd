const express = require('express');
const axios = require('axios')
const router = express.Router();

// Acts as a proxy server to make cors requests from anywhere. A clone
// of the service found at https://cors-anywhere.herokuapp.com/
// Source code from https://github.com/Rob--W/cors-anywhere/

router.get('/', async (req, res) => {
    // adapted from source code at https://github.com/rak-trzustki/busy-hours/blob/master/src/index.js

    const resError = (err) => {
        return res.status(500).json({
            status: 'error', 
            message: 'Error: ' + err
        });
    }

    let placeUrl = req.query.placeUrl;

    try {
        if (!placeUrl) {
            resError('Place URL missing');
        } else {
            const html = await fetch_html(placeUrl);

            if (html.status === 'error') {
                resError(html.message);
            } else {
                let popularTimes = process_html(html);

                res.status(200).json({
                    status: 'ok',
                    message: `Popular times returned from ${placeUrl}`,
                    popularTimes: await popularTimes //await popularTimes
                });
            }
        }
    } catch (err) {
        resError(err);
    }
});

const format_output = array => {
    return {
        hour: array[0],
        percentage: array[1]
    }
};

const extract_data = async html => {
    let str = ['APP_INITIALIZATION_STATE=', 'window.APP_FLAGS']
    let script = html.substring(html.lastIndexOf(str[0]) + str[0].length, html.lastIndexOf(str[1]));

    let first = eval(script);
    let second = eval(first[3][6].replace(")]}'", ""));

    return second[6][84];
};

const process_html = async html => {
    const popular_times = await extract_data(html);

    if (!popular_times) {
        return { status: 'error', message: 'Place has no popular hours' };
    }

    const data = { status: 'ok' };
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
        let html = await axios.get(url);
        return html.data || html.text();
    }
    catch (err) {
        return { status: 'error', message: 'Invalid url' };
    }
};

module.exports = router;