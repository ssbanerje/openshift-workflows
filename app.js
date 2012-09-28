var express = require('express'),
    routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set("view options", { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'visualWorkflow@IIITH' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use(function (req, res, next) {
        if (req.accepts('html')) {
            res.status(404);
            res.render('404', { url: req.url });
            return;
        }
        if (req.accepts('json')) {
            res.send({ error: 'Not found' });
            return;
        }
        res.type('txt').send('Not found');
    });
});

app.configure('development', function () {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    app.use(express.errorHandler());
});

// Routes
app.get('/proxy', routes.proxy);


// Bind
app.listen(3000, function () {
    console.log("Express server listening on port %d in %s mode\n", app.address().port, app.settings.env);
    if (app.settings.env === 'development') {
        console.log('Starting browser');
        require('./browser').open('http://localhost:' + app.address().port);
    }
});
