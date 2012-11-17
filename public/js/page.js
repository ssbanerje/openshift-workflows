/*
* Controlling the WebApp
* ~~ Here be Dragons ~~
*
*/

// Variable that controls whether connections are repainted or not
var repaint = false;

// The angular module for the page
var workflows = angular.module('workflows', ['ui', 'jqui']);

// The main angular controller for the page
var App = function ($scope, $http) {
    // Page related objects
    $scope.error = true;
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
    $scope.rules = {};

    //Variables related to the templates
    $scope.templates=[];

    // Generic call back to set error for all requests
    var errorCallback = function (data, status, headers, config) {
        Busy.stop();
        if ($scope.deleteRequestCount > 0) {
            return;
        }
        $scope.error = true;
        switch (status) {
            case 401:
                setError('Incorrect <strong>username</strong> or <strong>password</strong> entered');
            break;
            case 403:
                setError('The Openshift server is refusing to respond');
            break;
            case 404:
                var str = 'Page not found on server';
                if (data.error) {
                    str = JSON.parse(data.error).messages[0].text
                }
                setError(str);
            break;
            case 422:
                setError(JSON.parse(data.error).messages[0].text);
            break;
            case 500:
                var str = 'The server is broken! Retry in a while';
                if (data.error) {
                    str = JSON.parse(data.error).messages[0].text
                }
                setError(str);
            break;
            default:
                var str = 'Error in contacting server!';
                if (data.error) {
                    str = JSON.parse(data.error).messages[0].text
                }
                setError(str);
            break;
        }
    };

    // Call back to set error for deployment requests
    $scope.deleteRequestCount = 0;
    var errorCallbackForDeploy = function (data, status, headers, config) {
        errorCallback(data, status, headers, config);
        // Delete all applications that were made
        if($scope.deleteRequestCount != 0) {
            return false;
        }
        Busy.start();
        setError('Rolling back applications created');
        for (var i = 0; i<$scope.graph.vertices.length; i++) {
            proxify({ // Check if application is defined
                uri: $scope.host + '/broker/rest/domains/' + $scope.namespace + '/applications/' + $scope.appName + i,
                headers: {
                    accept: 'application/json; version=1.2',
                    Authorization: $scope.authString
                },
                method: 'DELETE'
            }, function (data, status, headers, config) {
                $scope.graph.vertices[i].deployed = false;
            }, function (data, status, headers, config) {
                console.log(data.data);
            });
            $scope.deleteRequestCount++;
        }
        Busy.stop();
        $scope.deployingApp = false;
    };

    /// Functions dealing with the connection parameters
    $scope.submit = function () { // Authenticate user and get the list of cartridges and templates
        Busy.start();
        $scope.cleargraph();
        $scope.connected = false;
        $scope.error = false;
        $('#connectionModal').modal('hide');
        $('#connection').css('color', '#d00');
        $scope.cartridges = [];
        $scope.templates=[];

        proxify({ // Authenticate user
           uri: $scope.host + '/broker/rest/user',
            headers: {
                accept: 'application/json; version=1.2',
                Authorization: 'Basic ' + window.btoa($scope.username + ':' + $scope.password)
            },
            method: 'GET'
        }, function (data, status, headers, config) {
            $scope.authString = 'Basic ' + window.btoa($scope.username + ':' + $scope.password);
            proxify({ // Check if application is defined
                uri: $scope.host + '/broker/rest/domains/' + $scope.namespace + '/applications',
                headers: {
                    accept: 'application/json; version=1.2',
                    Authorization: $scope.authString
                },
                method: 'GET'
            }, function (data, status, headers, cfg1) {
                var nameChecker = new RegExp('^'+$scope.appName.toLowerCase()+'[\\d]+$');
                var flag = false;
                for (var i in data.data) {
                    if (data.data[i].name.match(nameChecker) && data.data[i].name.match(nameChecker).length>0) {
                        setError('Application with this prefix already exists.');
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    Busy.stop();
                    return;
                } else {
                    proxify({ // Get list of cartridges
                        uri: $scope.host + '/broker/rest/cartridges',
                        headers: {
                            accept: 'application/json; version=1.2'
                        },
                        method: 'GET'
                    }, function (data, status, headers, cfg1) {
                        $http({ // Read configuration file for dependencies
                            url: '/config/rules.json',
                            method: 'GET'
                        }).success(function (config, st, h, cfg2) {
                            $scope.rules = config;
                        }).error(function (config, st, h, cfg2) {
                            setError('Could not get cartridge dependency rules.');
                        });
                        $http({ // Read configuration file for images
                            url: '/config/images.json',
                            method: 'GET'
                        }).success(function (config, st, h, cfg2) {
                            data.data.forEach(function (ele, i, arr) {
                                ele.img = config[ele.display_name];
                                if (ele.img === undefined) {
                                    ele.img = config['default'];
                                }
                            });
                        }).error(function (config, st, h, cfg2) {
                            setError('Could not get cartridge image configuration');
                        });
                        $scope.cartridges = data.data;
                        proxify({ // Get list of templates
                            uri: $scope.host + '/broker/rest/application_template',
                            headers: {
                                accept: 'application/json; version=1.2'
                            },
                            method: 'GET'
                        }, function (data, status, headers, cfg3) {
                            $http({ // Read configuration file for template images
                                url: '/config/template.json',
                                method: 'GET'
                            }).success(function (config, st, h, cfg3) {
                                data.data.forEach(function (ele, i, arr) {
                                    ele.type = 'template';
                                    ele.img = config[ele.display_name];
                                    if (ele.img === undefined) {
                                        ele.img = config['default'];
                                    }
                                });
                            }).error(function (config, st, h, cfg3) {
                                setError('Could not get application template configuration');
                            });
                            $scope.templates = data.data;
                            $('#connection').css('color', '#0d0');
                            $scope.connected = true;
                            Busy.stop();
                        }, errorCallback);
                    }, errorCallback);
                }
            }, errorCallback)
        }, errorCallback);
    }

    // Variables and functions used in the Graph
    $scope.ctr = 0;
    $scope.graph = new Graph();
    $scope.graph.addVertex('node0');

    $scope.addnode = function (ident) { // Add a node to the Graph
        $scope.ctr = $scope.ctr + 1;
        $scope.graph.addVertexWithParent('node' + $scope.ctr, ident);
    };

    $scope.removenode = function (ident) { // Remove a node from the Graph
        if ($scope.graph.vertices.length === 1) {
            $scope.cleargraph();
        } else {
            $scope.graph.removeVertex(ident);
        }
    };

    $scope.cleargraph = function () { // Delete the graph completely
        $scope.graph.vertices.forEach(function (e, i, arr) {
            $scope.graph.removeVertex(e.identifier);
        });
        $scope.ctr = 0;
        $scope.graph = new Graph();
        $scope.graph.addVertex('node0');
    };

    $scope.dragCartFromBar = function (item, list) { // Start the drag event for dragging object from cartridge list
        return {src: list, item: item};
    };

    $scope.acceptTokenInSubnode = function (targetArray, token) { // Check if drag target is acceptable
        if (token) {
            var cartridge = token.item;
            var siren = false;
            var conflicts=[];
            if(targetArray.length === 0) {
                if (cartridge.type === 'standalone') {
                    return true;
                } else if (cartridge.type === 'template') {
                    return true;
                } else {
                    setError('First cartridge must be a standalone or template.');
                }
            } else {
                if (cartridge.type === 'template') {
                    setError('Can install template in empty application only');
                    return false;
                }
                if (cartridge.type != 'standalone') {
                    for (var i in targetArray) {
                        if(targetArray[i].type === 'template') { // checking if added cartridge was a template
                            for (var j in Object.keys($scope.rules.template)) { // storing in conflicts which are pre-installed in template that conflict
                                if (targetArray[i].tags[1] === Object.keys($scope.rules.template)[j]) {
                                    for (var k in $scope.rules.template[Object.keys($scope.rules.template)[j]]) {
                                        conflicts[k]=$scope.rules.template[Object.keys($scope.rules.template)[j]][k];
                                    }
                                    siren = true; // siren if true shows that its template
                                    break;
                                }
                            }
                        }
                        if(siren === true) {
                            break;
                        }
                    }
                    if ($.inArray(cartridge, targetArray) < 0) {
                        var thisIsDB = false;
                        var dbAlreadyAdded = false;
                        for (var i in $scope.cartridges) { // checking if already a database was installed along with template
                            for (var j in conflicts ) {
                                if(conflicts[j] === $scope.cartridges[i].name) {
                                    if($.inArray('database',$scope.cartridges[i].tags)>=0) {
                                        dbAlreadyAdded = true;
                                        break;
                                    }
                                }
                            }
                            if(dbAlreadyAdded) {
                                break;
                            }
                        }
                        for (var i in cartridge.tags) {
                            if (cartridge.tags[i] === 'database') {
                                thisIsDB = true;
                                break;
                            }
                        }
                       var flag = false;
                        for (var i in targetArray) {
                            for (var j in targetArray[i].tags) {
                                if (targetArray[i].tags[j] === 'database') {
                                    dbAlreadyAdded = flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                break;
                            }
                        }
                        if (!(thisIsDB && dbAlreadyAdded)) {
                            // Checking if there is a rule for this cartridge
                            flag = false;
                            var check;
                            for (var i in Object.keys($scope.rules.cartridge)) {
                                if (cartridge.name === Object.keys($scope.rules.cartridge)[i]) {
                                    flag = true;
                                    check=i;
                                    break;
                                }
                            }
                            if (!flag) {
                                return true;
                            }
                            // Checking if rules for this cartridge were satsfied
                            flag = false;
                            var match=false;
                            for (var i in Object.keys($scope.rules.cartridge)) {
                                if (cartridge.name === Object.keys($scope.rules.cartridge)[i]) {
                                    for (var j in targetArray) {
                                        if ($.inArray(targetArray[j].name, $scope.rules.cartridge[Object.keys($scope.rules.cartridge)[i]]) >= 0) {
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if (flag && !siren) { // checking if dependency was already installed
                                        return true;
                                    } else {
                                        if (siren) {
                                            for (var k in conflicts) {
                                                if ($.inArray(conflicts[k],$scope.rules.cartridge[Object.keys($scope.rules.cartridge)[check]]) >= 0) {
                                                    match = true;
                                                    break;
                                                }
                                            }
                                        }
                                        if (match ) {
                                            return true;
                                        }
                                        setError('Install ' + $scope.rules.cartridge[Object.keys($scope.rules.cartridge)[i]] + ' first.');
                                    }
                                }
                            }
                        } else {
                            setError('Only one database cartridge is allowed.');
                        }
                    } else {
                        setError('Duplicate cartridges cannot be added.');
                    }
                } else {
                    setError('Cannot add this to application. Standalone cartridge or template already added.');
                }
            }
        }
        return false;
    };

    $scope.commitTokenInSubnode = function (to, token) { // Add cartridge to vertex
        to.push(token.item);
        repaint  = true;
    };

    $scope.deleteCartridge = function (cartridge, vertex) { // Delete cartridge from vertex
        if (cartridge.type === 'standalone' || cartridge.type === 'template') {
           vertex.cartridges = [];
           return;
        }
        var i = -1;
        for (i in vertex.cartridges) {
            if(vertex.cartridges[i] === cartridge) {
                break;
            }
        }
        if (i>=0) {
            var deleted = vertex.cartridges.splice(i, 1)[0];
            var keys = Object.keys($scope.rules.cartridge);
            for (var j in keys) {
               var pos = $.inArray(deleted.name, $scope.rules.cartridge[keys[j]]);
               console.log(pos);
               if (pos>=0) {
               console.log(keys[j]);
                  for (var k in vertex.cartridges) {
                     if (vertex.cartridges[k].name === keys[j]) {
                        vertex.cartridges.splice(k, 1);
                     }
                  }
               }
            }
        }
        repaint = true;
    };

    setInterval(function () { // Rpaint the edges so that changes in box size dont affect it
        if (repaint) {
            jsPlumb.repaintEverything();
        }
        repaint = false;
    }, 100);

    // Variables and functions relating to deployment
    $scope.deployingApp = false;
    $scope.deploy = function () { // Deploy the graph to a openshift broker
        $scope.deleteRequestCount = 0;
        Busy.start();
        $scope.deployingApp = true;
        for (var i in $scope.graph.vertices) {
            $scope.graph.vertices[i].deployed = false;
        }
        for (var i in $scope.graph.vertices) {
           if ($scope.graph.vertices[i].cartridges && $scope.graph.vertices[i].cartridges.length === 0) {
                setError('First add cartridges to all nodes');
                Busy.stop();
                return;
            }
        }
        $scope.graph.vertices.forEach(function (ele, i, arr) {
            var formData = {};
            if (ele.cartridges[0].type === 'standalone') {
                formData = {
                    name: $scope.appName + i.toString(),
                    cartridge: ele.cartridges[0].name,
                    scale: ele.properties.autoScale,
                    gear_profile: ele.properties.size
                };
            } else if (ele.cartridges[0].type === 'template') {
                formData = {
                    name: $scope.appName + i.toString(),
                    template: ele.cartridges[0].uuid,
                    scale: ele.properties.autoScale,
                    gear_profile: ele.properties.size
                };
            }
            proxify({
                uri: $scope.host + '/broker/rest/domains/' + $scope.namespace + '/applications',
                headers: {
                    accept: 'application/json; version=1.2',
                    Authorization: 'Basic ' + window.btoa($scope.username + ':' + $scope.password)
                },
                method: 'POST',
                form: formData
            }, function (data, status, headers, config) {
                $('.deploy_'+ i.toString() + '_0').css('color', '#0d0');
                data = JSON.parse(data.error);
                ele.properties.app.git = data.data.git_url;
                ele.properties.app.app = data.data.app_url;
                ele.properties.app.ssh = data.data.ssh_url;
                // Recursively create cartridges
                var recursiveProxify = function (j) {
                    if(j >= ele.cartridges.length) {
                        return;
                    }
                    proxify({
                        uri: $scope.host + '/broker/rest/domains/' + $scope.namespace + '/applications/' + $scope.appName + i.toString() + '/cartridges',
                        headers: {
                            accept: 'application/json; version=1.2',
                            Authorization: 'Basic ' + window.btoa($scope.username + ':' + $scope.password)
                        },
                        method: 'POST',
                        form: {
                            cartridge: ele.cartridges[j].name
                        }
                    }, function (data, status, headers, config) {
                        $('.deploy_'+ i.toString() + '_' + j.toString()).css('color', '#0d0')
                        data = JSON.parse(data.error);
                        var cartData = {};
                        cartData.name = data.data.name;
                        for (var k in data.data.properties) {
                            var props = data.data.properties;
                            if (props[k].name === '' || props[k].value === '') {
                                continue;
                            }
                            cartData[props[k].name] = props[k].value;
                        }
                        ele.properties.cartridge.push(cartData);
                        recursiveProxify(j+1);
                    }, errorCallbackForDeploy);
                };
                recursiveProxify(1);
                ele.deployed = true;
            }, errorCallbackForDeploy);
            // Check to see if all operations have been finished
            var int = setInterval(function () {
                var flag = true;
                for (var i=0; i<$scope.graph.vertices.length; i++) {
                    flag = flag && $scope.graph.vertices[i].deployed;
                }
                if (flag) {
                    $scope.deployingApp = false;
                    Busy.stop();
                    clearInterval(int);
                }
            }, 1000);
        });
    };
};
