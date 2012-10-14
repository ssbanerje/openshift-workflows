var Page = {
    State : {
        rapi: undefined,
        connected: false
    },

    setError : function SetError(text) {
        $('#errorPlaceHolder').html('<div class="alert alert-error fade in">' + text
                                    + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    }
};

// Communicate between controllers
var angApp = angular.module('workflows', []);
angApp.factory('messageBoard', function ($rootScope) {
    var board = {};
    board.cartridges = [];
    board.broadcastCartridges = function (cartridges) {
        var i;
        this.cartridges = cartridges;
        // Gets the output of the REST API of the Broker
        // We cant consume it just yet...
        for (i = 0; i < this.cartridges.length; i = i + 1) {
            this.cartridges[i].img = 'http://placehold.it/100x100';
        }
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
    $scope.cartridges = [{img : 'http://placehold.it/100x100'}];
    
    $scope.$on('newCartridgesListed', function () {
        $scope.cartridges = messageBoard.cartridges;
    });
    
    $scope.click = function () {
        console.log($scope.cartridges); 
    }
};
Cartridges.$inject = ['$scope', 'messageBoard'];

    
    
// Main!
$(function () {
    // Check current connection
    setInterval(function () {
        if (!Page.State.connected) {
            $('#cartridges').hide();
            $('#connection').css('color', '#d00');
            Page.setError('<strong>Configure</strong> the system by setting <strong>connection</strong> parameters.');
        }
    }, 1000);

    // Get connection parameters for PaaS provider
    $('.connectionParam').click(function () {
        //$('#listCartridges').hide();
        $('#connectionModal').modal('show');
    });
    
    // Connect to PaaS provider and get all data
    $('#reconnect').click(function () {
        $('#connection').css('color', '#0d0');
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
