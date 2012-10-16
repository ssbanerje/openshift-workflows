/**
*
* Controlling the WebApp
* ~~ Here be Dragons ~~
*
*/

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
            case 403:
                setError('The Openshift server is refusing to respond');
                break;
            case 500:
                setError('The server is broker! Retry in a while');
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
