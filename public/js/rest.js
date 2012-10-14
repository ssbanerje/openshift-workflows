/**
*
* The REST interface to OpenShift
*
*/
var Rest = function (dom) {
    var domain = dom; // Domain of openshift broker
    this.authString = undefined; // The authstring which needs to be passed to OpenShift
    this.connected = false; // Is this connected to the server?
    this.api = undefined; // API of the Broker
    this.cartridges = undefined; //List of cartridges supported by broker

    this.proxify = function (data, callback) { // Send data to host through the proxy
        var _this = this;
        $.ajax({
            'url': '/proxy',
            'dataType': 'json',
            'type': 'POST',
            'data': {
                options: JSON.stringify(data)
            },
            'success': function (data, textStatus, jqXHR) {
                callback(data, _this);
            },
            'error': function (jqXHR, text, error) {
                switch (error) {
                        case 'Unauthorized':
                            Page.setError('<strong> Unauthorized </strong>: Incorrect username or password.');
                            break;
                        default:
                            Page.setError('Could not connect to server.');
                            break;
                }
                Page.stopSpinner();
            }
        });
    };

    this.getApi = function () { // Get the API reference
        var data = {
            uri: domain + '/broker/rest/api',
            headers: {
                accept: 'application/json'
            },
            method: 'GET'
        };
        var callback = function (d, _this) {
            _this.api = d;
        };
        this.proxify(data, callback);
    };

    this.authenticate = function (username, password) { // Authenticate user on domain
        var auth = 'Basic ' + window.btoa(username + ':' + password);
        var data = {
            uri: domain + '/broker/rest/user',
            headers: {
                accept: 'application/json',
                Authorization: auth
            },
            method: 'GET'
        };
        var callback = function (d, _this) {
            _this.authString = auth;
            _this.connected = true;
        };
        this.proxify(data, callback);
    };

    this.getCartridges = function () { // Get a list of cartrdges from the broker
        var data = {
            uri: domain + '/broker/rest/cartridges',
            headers: {
                accept: 'application/json'
            },
            method: 'GET'
        };
        var callback = function (d, _this) {
            _this.cartridges = d.data;
        };
        this.proxify(data, callback);
    };
};

