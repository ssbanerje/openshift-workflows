// Send data to host through the proxy
function proxify(data, callback) {
    $.ajax({
        'url': '/proxy',
        'dataType': 'json',
        'data': data,
        'success': function (data, textStatus, jqXHR) {
        }
    });
}

// The required rest interface
var Rest = {
    authenticate : function (domain, username, password) {
        var data = {
            "username": username,
            "password": password,
            "url": domain,
            "method": "GET"
        };
        var callback = function (d) {
        };
        proxify(data, callback);
    }
};
