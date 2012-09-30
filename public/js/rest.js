// Send data to host through the proxy
function proxify(data) {
    $.ajax({});
}

// The required rest interface
var Rest = {
    authenticate : function(domain, username, password) {
        var data = {
            "Authorization": "Basic "+window.btoa(username+':'+password),
            "Domain": domain
        };
    }
};
