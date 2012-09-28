$.support.cors = true;

OpenShift_Rest = {
    authenticate : function(username, password) {
        encodedString = window.btoa(username+':'+password);
        $.ajax({
            url: 'https://openshift.redhat.com/broker/rest/api',
            dataType: 'json',
            accept: "application/json",
            crossDomain: true,
            success: function(data, textStatus, jqXHR){
                console.log(data);
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log(textStatus);
                console.log(errorThrown);
            }
        });
    }
};