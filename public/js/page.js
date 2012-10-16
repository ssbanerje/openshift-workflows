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
           switch(messageBoard.cartridges[i].display_name) {
              case 'Node.js 0.6':
                 messageBoard.cartridges[i].img = '/img/icons/nodejs.png';
                 break;
              case 'Zend Server 5.6':
                 messageBoard.cartridges[i].img= '/img/icons/zend.png';
                 break;
               case 'Ruby 1.9':
                  messageBoard.cartridges[i].img= '/img/icons/ruby.png';
                break;

               case 'JBoss Application Server 7.1':
                   messageBoard.cartridges[i].img= '/img/icons/jboss.png';
               break;

               case 'Python 2.6':

                  messageBoard.cartridges[i].img= '/img/icons/python.png';
                 break;

                case 'Jenkins Server 1.4':
                  messageBoard.cartridges[i].img= '/img/icons/jenkins.png';
                 break;

                case 'Ruby 1.8':
                  messageBoard.cartridges[i].img= '/img/icons/ruby.png';
                 break;

                case 'JBoss Enterprise Application Platform 6.0':
                  messageBoard.cartridges[i].img= '/img/icons/jboss.png';
                 break;

                case 'PHP 5.3':
                  messageBoard.cartridges[i].img= '/img/icons/php.png';
                 break;
                case 'Perl 5.10':
                  messageBoard.cartridges[i].img= '/img/icons/perl.png';
                 break;
                case 'MongoDB NoSQL Database 2.0':
                  messageBoard.cartridges[i].img= '/img/icons/mongodb.png';
                 break;
                case 'Cron 1.4':
                  messageBoard.cartridges[i].img= '/img/icons/cron.png';
                 break;
                case 'MySQL Database 5.1':
                  messageBoard.cartridges[i].img= '/img/icons/mysql.png';
                 break;
                case 'PostgreSQL Database 8.4':
                  messageBoard.cartridges[i].img= '/img/icons/postgresql.png';
                 break;
                case 'HAProxy 1.4':
                  messageBoard.cartridges[i].img= '/img/icons/haproxy.png';
                 break;

                case '10gen Mongo Monitoring Service Agent 0.1':
                  messageBoard.cartridges[i].img= '/img/icons/mongodb.png';
                 break;
                case 'phpMyAdmin 3.4':
                  messageBoard.cartridges[i].img= '/img/icons/php.png';
                 break;
                case 'OpenShift Metrics 0.1':
                  messageBoard.cartridges[i].img= '/img/icons/openshift.png';
                 break;
                case 'RockMongo 1.1':
                  messageBoard.cartridges[i].img= '/img/icons/mongodb.png';
                 break;
                case 'Jenkins Client 1.4':
                  messageBoard.cartridges[i].img= '/img/icons/jenkins.png';
                 break;

                 default:
                 messageBoard.cartridges[i].img = 'http://placehold.it/120x80';
                 break;
           }
        }
        $scope.cartridges = messageBoard.cartridges;
        setTimeout(function () {
            $scope.$digest();
            $("[rel=popover]").popover({
                animation: true,
                trigger: 'hover',
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
