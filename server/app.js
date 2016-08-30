const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bunyan = require('bunyan');
const serializers = require('./logging/serializers')
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

const app = express();

/* ****************** LOGGING ******************** */
var bunyanConfig = {
    name: 'node-express-hbs-sass-project-template',
    level: bunyan.INFO
}
if (process.env.env === 'development') {
    bunyanConfig.level = bunyan.DEBUG;
    //bunyanConfig.serializers.res = serializers.resSerializerDebug;
}
const log = bunyan.createLogger(bunyanConfig);

/* ****************** VIEW ENGINE ******************** */
const hbs = exphbs.create({
    extname: ".hbs",
    layoutsDir: "./server/appLayouts",
    partialsDir: "./server",
    defaultLayout: "master"
});
app.set('views', './server');
app.engine('handlebars', hbs.engine);
app.set('view engine', 'hbs');

/* ****************** MIDDLEWARE ******************** */
// Import custom middleware modules
const loggingMiddleware = require('./middleware/logging');

// Register middleware
app.use(loggingMiddleware(log, app));

/* ****************** ROUTES ******************** */
// Import component routes
const helloWorldRouter = require('./components/helloWorld/routes');

// Mount the component routes
app.use('/helloWorld', helloWorldRouter);

/* ****************** ERROR HANDLERS ******************** */

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    req.log.debug('Entered HTTP/404 handler function');
    let now = new Date();
    req.log.warn({
        req: serializers.reqSerializer404(req)
    }, 'User encountered resource not found.')
    res.status(404);
    res.render('globalAppViews/notfound', {
        url: req.url,
        referrer: req.referrer,
        req_id: req.req_id,
        timestamp: now.toISOString()
    });
});

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        req.log.debug('Entered server error handler function [debug]');
        let now = new Date();
        req.log.error({
            req: serializers.reqSerializerDebug(req),
            err: err
        }, 'User encountered a server error.');
        res.status(err.status || 500);
        res.render('globalAppViews/error', {
            message: err.message,
            url: req.url,
            referrer: req.referrer,
            req_id: req.req_id,
            timestamp: now.toISOString()
        });
    });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err, req, res, next) {
    req.log.debug('Entered server error handler function');
    let now = new Date();
    req.log.error({
        req: serializers.reqSerializer(req),
        err: err
    }, 'User encountered a server error.');
    res.status(err.status || 500);
    res.render('globalAppViews/error', {
        message: err.message,
        url: req.url,
        referrer: req.referrer,
        req_id: req.req_id,
        timestamp: now.toISOString()
    });
});


app.listen(3000, function () {
    log.info('Applicaiton started...', {
        env: process.env.env,
        logLevel: log.level(),
        processInfo: serializers.processInfoSerializer()
    })
});
