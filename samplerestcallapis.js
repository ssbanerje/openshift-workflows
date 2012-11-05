var proxify = function (options, successCallback, failureCallback) { // Make call to the openshift broker
        $http({ // Proxify!
            url: '/proxy',
            method: 'POST',
            dataType: 'json',
            data: { options: JSON.stringify(options) }
        }).success(successCallback).error(failureCallback);
    };
proxify({ // Authenticate user
                   uri: $scope.host + '/broker/rest/user',
                   headers: {
                       accept: 'application/json',
                       Authorization: 'Basic ' + window.btoa($scope.username + ':' + $scope.password)
                   },
                   method: 'GET'
               },)
// using rest calls.......
//creating domain
curl -k -X POST https://openshift.redhat.com/broker/rest/domains/ --user "sandeep.panem870@gmail.com:password" --data "panem"
//creating application
curl -k -X POST
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications --
   user "[UserName]:[Password]" --data "name=[AppName]&cartridge=php-
5.3&scale=false"
//get application info
curl -k -X GET
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name] --user "[UserName]:[Password]"
//start application
curl -k -X POST
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name]/events --user "[UserName]:[Password]" --data "event=start"
curl -k -X POST
//stop application
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name]/events --user "[UserName]:[Password]" --data "event=stop"
// restart application
curl -k -X POST
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name]/events --user "[UserName]:[Password]" --data "event=restart""
//delete application
curl -k -X DELETE
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name] -user "[UserName]:[Password]"
// get gear info
curl -k -X GET
https://openshift.redhat.com/broker/rest/domains/[Domain_ID]/applications/[App_Name]/gears --user "[UserName]:[Password]"

