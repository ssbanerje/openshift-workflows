// Forward requests from the client to the OpenShift Broker

var request = require('request');

exports.proxify = function (req, res) {
    var options = null;
    res.contentType('application/json');
    if (req.body.options) {
        var options = JSON.parse(req.body.options);
        request(options, function (error, response, body) {
            if(response === undefined) {
                res.status(500).send({error: body});
                return;
            }
            if (!error && response.statusCode == 200) {
                res.send(body);
            } else {
                res.status(response.statusCode || 404).send({error: body});
            }
        });
    } else {
        res.status(500).send({error: 'No options specified in HTTP request'});
    }
};
