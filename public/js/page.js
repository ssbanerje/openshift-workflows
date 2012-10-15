/**
*
* Controlling the WebApp
* ~~ Here be Dragons ~~
*
*/

// Set the global error in the application
function setError(text) {
    $('#errorPlaceHolder').html('<div class="alert alert-error fade in">' + text
                                + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
}

// The angular module for the page
var workflows = angular.module('workflows', []);

// The main angular controller for the page
var App = function ($scope, $http) {
    // Page related objects 
    var Busy = {  // Show a spinner to indicate busy status
        spinner: undefined,
        
        start : function () {
            $('#spinner').html('&nbsp;&nbsp;');
            if (!this.spinner) {
                this.spinner = new Spinner({
                    lines: 9, length: 3, width: 3, radius: 4, corners: 1, rotate: 0,
                    color: '#fff', speed: 1.3, trail: 100, shadow: false, className: 'spinner',
                    zIndex: 2e9, top: '5px', left: 'auto'
                }).spin(document.getElementById('spinner'));
            } else {
                this.spinner.spin(document.getElementById('spinner'));
            }
        },
        
        stop : function () {
            this.spinner.stop();
            $('#spinner').html('<i class="icon-cloud"></i>');
        }
    };
    var proxify = function (options, successCallback, failureCallback) { // Make call to the openshift broker
        $http({ // Proxify!
            url: '/proxy',
            method: 'POST',
            dataType: 'json',
            data: { options: JSON.stringify(options) }
        }).success(successCallback).error(failureCallback);
    };
    
    // Variables related to the connection parameters
    $scope.host = 'https://openshift.redhat.com';
    $scope.username = '';
    $scope.password = '';
    $scope.authString = '';
    $scope.appName = '';
    $scope.namespace = '';
    $scope.connected = false;
    
    // Variables related to the cartridges
    $scope.cartridges = [];
    
    // Functions dealing with the connection parameters
    $scope.submit = function () { // Authenticate user and get the list of cartridges
        Busy.start();
        $('#connectionModal').modal('hide');
        $('#cartridges').hide();
        $(".alert").alert('close');
        $('#connection').css('color', '#d00');
        $scope.cartridges = [];
        var errorCallback = function (data, status, headers, config) {
            Busy.stop();
            switch (status) {
            case 401:
                setError('Incorrect <strong>username</strong> or <strong>password</strong> entered');
                break;
            default:
                setError('Error in contacting server!');
                break;
            }
        };
        proxify({ // Authenticate user
            uri: $scope.host + '/broker/rest/user',
            headers: {
                accept: 'application/json',
                Authorization: 'Basic ' + window.btoa($scope.username + ':' + $scope.password)
            },
            method: 'GET'
        },
            function (data, status, headers, config) {
                $scope.authString = 'Basic ' + window.btoa($scope.username + ':' + $scope.password);
                $scope.connected = true;
                proxify({ // Get list of cartridges
                    uri: $scope.host + '/broker/rest/cartridges',
                    headers: {
                        accept: 'application/json'
                    },
                    method: 'GET'
                },
                    function (data, status, headers, config) {
                        var i;
                        for (i = 0; i < data.data.length; i = i + 1) {
                            data.data[i].img = 'http://placehold.it/120x80';
                        }
                        $scope.cartridges = data.data;
                        $('#connection').css('color', '#0d0');
                        $('#cartridges').show();
                        Busy.stop();
                    }, errorCallback);
            }, errorCallback);
    };
};

// Main!
$(function () {
    // Get connection parameters for PaaS provider
    $('.connectionParam').click(function () {
        $('#connectionModal').modal('show');
    });

    // All features for node tags
    $('.node').hover(function () {
        $(this).find('.controller').show();
    }, function () {
        $(this).find('.controller').hide();
    });

    // Show Cartridges
    $('#showCartridges').click(function () {
        $('#listCartridges').slideToggle('slow', function () {
            var text = '<div class="realtive">';
            if ($(this).is(":hidden")) {
                text += 'Cartridges <i class="icon-chevron-up"></i>';
            } else {
                text += 'Cartridges <i class="icon-chevron-down"></i>';
            }
            text += '</div>';
            $('#showCartridges').html(text);
        });
    });
    
    setInterval(function () {
        $("[rel=popover]").popover({
            animation: true,
            trigger: 'click',
            offset: 10,
            placement: 'top'
        }).click(function (e) { e.preventDefault(); });
    }, 1000);
});
