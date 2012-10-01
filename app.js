var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    routes = require('./routes');

var app = express();

// Configuration
app.configure(function () {
    app.set('httpPort', process.env.HTTP_PORT || 3000);
    app.set('httpsPort', process.env.HTTPS_PORT || 4000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser('visualWorkflow@IIITH'));
    app.use(express.session());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(function (req, res, next) {
        if (req.accepts('html')) {
            res.status(404).render('404', { url: req.url });
            return;
        }
        if (req.accepts('json')) {
            res.send(404, { error: 'Not found' });
            return;
        }
        res.type('txt').send(404, 'Not found');
    });
});

app.configure('development', function () {
    app.use(express.errorHandler());
});


// Routes
app.get('/proxy', routes.proxy);


// Bind HTTP Server
http.createServer(app).listen(app.get('httpPort'), function () {
    console.log("Express HTTP server listening on port " + app.get('httpPort'));
});

// Bind HTTPS Server
var privateKey = fs.readFileSync('certs/key.pem').toString();
var certificate = fs.readFileSync('certs/certificate.pem').toString();
https.createServer({key: privateKey, cert: certificate}, app).listen(app.get('httpsPort'), function () {
    console.log("Express HTTPS server listening on port " + app.get('httpsPort'));
    require('./browser').open('https://localhost:' + app.get('httpsPort'));
});
