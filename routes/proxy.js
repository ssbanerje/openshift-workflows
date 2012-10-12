// Forward requests from the client to the OpenShift Broker

var request = require('request');

exports.proxify = function (req, res) {
    var options = { // Get options from request <<-- TODO
        uri: 'https://openshift.redhat.com/broker/rest/api',
        headers: {
            accept: 'application/json'
        },
        method: 'GET'
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    });
};
