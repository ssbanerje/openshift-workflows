/**
*
* The REST interface to OpenShift
*
*/
var Rest = function(dom) {
    var authString = '', // The authstring which needs to be passed to OpenShift
        domain = dom; // Domain of openshift broker
    this.api = {}; // API of the Broker 
    
    var proxify = function (data, callback) { // Send data to host through the proxy
        $.ajax({
            'url': '/proxy',
            'dataType': 'json',
            'type': 'POST',
            'data': {
                options: JSON.stringify(data)
            },
            'success': function (data, textStatus, jqXHR) {
                callback(data);
            }
        });
    };
    
    this.getApi = function () { // Get the API reference
        var data = {
            uri: domain+'/broker/rest/api',
            headers: {
                accept: 'application/json'
            },
            method: 'GET'
        };
        var callback = function (d) {
            this.api = d;
        };
        proxify(data, callback);
    };
    
    this.authenticate = function (username, password) { // Authenticate user on domain
        var auth = 'Basic ' + window.btoa(username + ':' + password);
        var data = {
            uri: domain+'/broker/rest/domains',
            headers: {
                accept: 'application/json',
                Authorization: auth
            },
            method: 'GET'
        };
        var callback = function (d) {
            authString = auth;
        };
        proxify(data, callback);
    };
};
