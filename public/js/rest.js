// Send data to host through the proxy
function proxify(data, callback) {
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

// The required rest interface
var Rest = {
    test : function () {
        var data = { // Get options from request <<-- TODO
            uri: 'https://openshift.redhat.com/broker/rest/api',
            headers: {
                accept: 'application/json'
            },
            method: 'GET'
        };
        var callback = function (d) {
            console.log(d);
        };
        proxify(data, callback);
    }
};
