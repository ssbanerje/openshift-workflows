/**
*
* The REST interface to OpenShift
*
*/
var Rest = function(dom) {
    var username = '', // Openshift username
        password = '', // Openshift password
        domain = dom; // Domain of openshift broker
    this.api = {}; // API of the Broker 
    
    var authString = function (username, password) { // Get the user authentcation/authorzation string
        return 'Basic ' + window.btoa(username + ':' + password);
    };
    
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
    
    this.authenticate = function (u, p) { // Authenticate user on domain
        var data = {
            uri: domain+'/broker/rest/domains',
            headers: {
                accept: 'application/json',
                Authorization: authString(u, p)
            },
            method: 'GET'
        };
        var callback = function (d) {
            username = u;
            password = p;
        };
        proxify(data, callback);
    };
};
