/* this file spins up an Express application that makes handling requests easier for us */

const express = require('express');
const path = require('path');
const cors = require('cors');
// a logger middleware. morgan will use the 'next' method (passed to api functions) 
// in order to log api requests in the console without interfering
const morgan = require('morgan');
const bodyParser = require('body-parser');

// for hosting api AND react app in one Heroku app
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

var app;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
    console.error(`Node cluster master ${process.pid} is running`);
  
    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
  
    cluster.on('exit', (worker, code, signal) => {
        console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
    });
    
} else {
    const app = express(); // start the express application which lets us use utility methods, etc.   

    var corsOptions = {
        origin: "http://localhost:8081"
    };
    
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    // ensures the api can handle different-origin requests (requests from urls other than here) AKA handles CORS errors
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET') // UPDATE?
            return res.status(200).json({});
        }
        next();
    });

    // Priority serve any static files.
    app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
    
    // redirecting function passed into app.use() to the file with route specified
    // const customRoutes = require('./routes/custom');
    // .use() sets up some middleware. an incoming request (and its body) must go through .use() 
    // app.use('/api/custom', customRoutes);

    const poptimesRoutes = require('./routes/poptimes');
    app.use('/poptimes', poptimesRoutes);

    // All remaining requests return the React app, so it can handle routing.
    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
    });

    // forward an invalid route request using the 'next' function
    app.use((req, res, next) => {
        const error = new Error('Sorry, we couldn\'t find that for you :(');
        error.status = 404;
        next(error);
    });

    // handles errors thrown from anywhere in the application
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            error: {
                message: err.message
            }
        });
    });

    app.listen(PORT, function () {
        console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
    });
}

module.exports = app;