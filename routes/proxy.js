// Forward requests from the client to the OpenShift Broker

var request = require('request');

exports.proxify = function (req, res) {
    var options = JSON.parse(req.body.options);
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    });
};
