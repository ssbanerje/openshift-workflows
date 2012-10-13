// The Rest interface
var Rest = {
    // Authenticationd details
    username: '',
    password: '',
    domain: '',
    api: {},
    
    api: function (domain) { // Get the API reference
        var data = {
            uri: domain+'/broker/rest/api',
            headers: {
                accept: 'application/json'
            },
            method: 'GET'
        };
        var callback = function (d) {
            Rest.api = d;
            Rest.domain = domain;
        };
        Rest.proxify(data, callback);
    },
    
    authenticate: function (username, password) { // Authenticate user on domain
        var data = {
            uri: Rest.domain+'/broker/rest/domains',
            headers: {
                accept: 'application/json',
                Authorization: Rest.authString(username, password)
            },
            method: 'GET'
        };
        var callback = function (d) {
            Rest.username = username;
            Rest.password = password;
        };
        Rest.proxify(data, callback);
    },
    
    authString: function (username, password) { // Get the user authentcation/authorzation string
        return 'Basic '+window.btoa(username+':'+password);
    },
    
    proxify: function (data, callback) { // Send data to host through the proxy
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
    }
};
