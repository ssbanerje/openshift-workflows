var Page = {
    State : {
        connected: false,
        username: '',
        password: '',
        host: '',
        app: '',
        namespace: ''
    },

    setError : function SetError(text) {
        $('#errorPlaceHolder').html('<div class="alert alert-error fade in">'+text
                                    +'<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    }
}

// Communicate between controllers
var angApp = angular.module('workflows', []);
angApp.factory('messageBoard', function($rootScope) {
    var board = {};    
    board.cartridges = [];
    board.broadcastCartridges = function(cartridges) {
        this.cartridges = cartridges;
        this.pushCartridges();
    };
    board.pushCartridges = function() {
        $rootScope.$broadcast('newCartridgesListed');
    };
    return board;
});

// The AngularJS Controller for the connection parameters
var ConnectionParams = function ($scope, messageBoard) {
    $scope.host = '';
    $scope.username = '';
    $scope.password = '';
    $scope.appName = '';
    $scope.namespace = '';
    $scope.submit = function () {
        //alert($scope.host + ', ' + $scope.username + ', ' + $scope.password + ', ' + $scope.appName + ', ' + $scope.namespace);
        cartridges = [
            { src: "img/icons/openshift_logo.png" }, 
            { src : "http://4.bp.blogspot.com/-dxDKlrr2Oe4/T9wkNoATkHI/AAAAAAAABM8/1_woWzunk2k/s320/2000px-php-logo-svg_.png" },
            { src : "http://sidelab.com/wp-content/uploads/2012/01/nodejs-light.png" },
            { src : "http://rubyonrails.org/images/rails.png" },
            { src : "http://4.bp.blogspot.com/-EMppjKV3JgQ/T88FwkeP1OI/AAAAAAAABCM/xCH9r9kcams/s400/2000px-python_logo-svg_.png" },
            { src : "http://4.bp.blogspot.com/-L6v3vXhedLk/T8wJcH1xEMI/AAAAAAAAA_A/SCUfiKVs9uk/s320/Rlogo-1.png" },
            { src : "http://info.10gen.com/rs/10gen/images/mongodb%20badge.png" },
            { src : "http://www.mysql.com/common/logos/logo-mysql-110x57.png" },
            { src : "http://upload.wikimedia.org/wikipedia/commons/a/a5/Couchdb-logo.png" },
            { src : "http://slashdot.org/topic/wp-content/uploads/2012/07/hadoop-elephant.png" },
            { src : "img/icons/openshift_logo.png" },
            { src : "http://4.bp.blogspot.com/-dxDKlrr2Oe4/T9wkNoATkHI/AAAAAAAABM8/1_woWzunk2k/s320/2000px-php-logo-svg_.png" },
            { src : "http://sidelab.com/wp-content/uploads/2012/01/nodejs-light.png" },
            { src : "http://rubyonrails.org/images/rails.png" },
            { src : "http://4.bp.blogspot.com/-EMppjKV3JgQ/T88FwkeP1OI/AAAAAAAABCM/xCH9r9kcams/s400/2000px-python_logo-svg_.png" },
            { src : "http://4.bp.blogspot.com/-L6v3vXhedLk/T8wJcH1xEMI/AAAAAAAAA_A/SCUfiKVs9uk/s320/Rlogo-1.png" },
            { src : "http://info.10gen.com/rs/10gen/images/mongodb%20badge.png" },
            { src : "http://www.mysql.com/common/logos/logo-mysql-110x57.png" },
            { src : "http://upload.wikimedia.org/wikipedia/commons/a/a5/Couchdb-logo.png" },
            { src : "http://slashdot.org/topic/wp-content/uploads/2012/07/hadoop-elephant.png" },
            { src : "img/icons/openshift_logo.png" },
            { src : "http://4.bp.blogspot.com/-dxDKlrr2Oe4/T9wkNoATkHI/AAAAAAAABM8/1_woWzunk2k/s320/2000px-php-logo-svg_.png" },
            { src : "http://sidelab.com/wp-content/uploads/2012/01/nodejs-light.png" },
            { src : "http://rubyonrails.org/images/rails.png" },
            { src : "http://4.bp.blogspot.com/-EMppjKV3JgQ/T88FwkeP1OI/AAAAAAAABCM/xCH9r9kcams/s400/2000px-python_logo-svg_.png" },
            { src : "http://4.bp.blogspot.com/-L6v3vXhedLk/T8wJcH1xEMI/AAAAAAAAA_A/SCUfiKVs9uk/s320/Rlogo-1.png" },
            { src : "http://info.10gen.com/rs/10gen/images/mongodb%20badge.png" },
            { src : "http://www.mysql.com/common/logos/logo-mysql-110x57.png" },
            { src : "http://upload.wikimedia.org/wikipedia/commons/a/a5/Couchdb-logo.png" },
            { src : "http://slashdot.org/topic/wp-content/uploads/2012/07/hadoop-elephant.png" }
        ];
        Page.State.connected = true;
        $('#cartridges').show();
        $('#connection').css('color','#0d0');
        messageBoard.broadcastCartridges(cartridges);
        $('#connectionModal').modal('hide')
    };
}
ConnectionParams.$inject = ['$scope', 'messageBoard'];

// The AngularJS Controller for the listed cartridges
var Cartridges = function ($scope, messageBoard) {
    $scope.cartridges = [];
    $scope.$on('newCartridgesListed', function() {
        $scope.cartridges = messageBoard.cartridges;
        console.log(messageBoard.cartridges);
    });
}
Cartridges.$inject = ['$scope', 'messageBoard'];

    
    
// Main!
$(function () {
    // Check current connection
    setInterval(function () {
        if(!Page.State.connected) {
            $('#cartridges').hide();
            $('#connection').css('color','#d00');
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
        $('#connection').css('color','#0d0');
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
            if($(this).is(":hidden")) {
                text += 'Cartridges <i class="icon-chevron-up"></i>';
            } else {
                text += 'Cartridges <i class="icon-chevron-down"></i>';
            }
            text += '</div>';
            $('#showCartridges').html(text)
        });
    });
});
