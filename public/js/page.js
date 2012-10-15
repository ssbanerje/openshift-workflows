/**
*
* Controlling the WebApp
* ~~ Here be Dragons ~~
*
*/

var Page = {
    State : { // The page state
        rapi: undefined,
        connected: false
    },

    setError : function SetError(text) { // Set the global error in the application
        $('#errorPlaceHolder').html('<div class="alert alert-error fade in">' + text
                                    + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    },
    
    spinner: undefined, // Show a spinner to indicate busy status
    startSpinner : function () {
        $('#spinner').html('&nbsp;&nbsp;');
        if(!this.spinner) {
            this.spinner = new Spinner({
                lines: 9, length: 3, width: 3, radius: 4, corners: 1, rotate: 0,
                color: '#fff', speed: 1.3, trail: 100, shadow: false, className: 'spinner',
                zIndex: 2e9, top: '5px', left: 'auto'
            }).spin(document.getElementById('spinner'));
        } else {
            this.spinner.spin(document.getElementById('spinner'));
        }
    },
    stopSpinner : function () {
        this.spinner.stop();
        $('#spinner').html('<i class="icon-cloud"></i>');
    }
};

// Communicate between controllers
var angApp = angular.module('workflows', []);
angApp.factory('messageBoard', function ($rootScope) {
    var board = {};
    board.cartridges = [];
    board.broadcastCartridges = function (cartridges) {
        this.cartridges = cartridges;
        this.pushCartridges();
    };
    board.pushCartridges = function () {
        $rootScope.$broadcast('newCartridgesListed');
    };
    return board;
});

// The AngularJS Controller for the connection parameters
var ConnectionParams = function ($scope, messageBoard) {
    $scope.host = 'https://openshift.redhat.com';
    $scope.username = '';
    $scope.password = '';
    $scope.appName = '';
    $scope.namespace = '';
    
    $scope.submit = function () { // Check the connection details and get the cartridge list
        Page.State.connected = false;
        $(".alert").alert('close');
        $('#connection').css('color', '#d00');
        messageBoard.broadcastCartridges([]);
        $('#cartridges').hide();
        Page.startSpinner();
        var restObj = new Rest($scope.host);
        restObj.getApi();
        restObj.authenticate($scope.username, $scope.password);
        restObj.getCartridges();
        var interval = setInterval(function () {
            if (restObj.connected && !Page.State.connected) {
                Page.State.connected = true;
                Page.State.rapi = restObj;
                $('#connection').css('color', '#0d0');
                messageBoard.broadcastCartridges(Page.State.rapi.cartridges);
                $('#cartridges').show();
                Page.stopSpinner();
            }
        }, 1000);
        $('#connectionModal').modal('hide');
        setTimeout(function () {
            window.clearInterval(interval);
            if (!Page.State.rapi || !Page.State.connected) {
                Page.setError('<strong>Incorrect</strong> connection parameters.');
            }
        }, 15000);
    };
};
ConnectionParams.$inject = ['$scope', 'messageBoard'];

// The AngularJS Controller for the listed cartridges
var Cartridges = function ($scope, messageBoard) {
    $scope.cartridges = [];
    $scope.$on('newCartridgesListed', function () {
        var i;
        for (i = 0; i < messageBoard.cartridges.length; i = i + 1) {
            messageBoard.cartridges[i].img = 'http://placehold.it/120x80';
        }
        $scope.cartridges = messageBoard.cartridges;
        setTimeout(function () {
            $scope.$digest();
            $("[rel=popover]").popover({
                animation: true,
                trigger: 'click',
                offset: 10,
                placement: 'top'
            }).click(function(e) {e.preventDefault()});
        }, 300);
    });
};
Cartridges.$inject = ['$scope', 'messageBoard'];

    
    
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
});
