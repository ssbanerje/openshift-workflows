Page = {
    setError : function SetError(text) {
        $('#errorPlaceHolder').html('<div class="alert alert-error fade in">'+text
                                    +'<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    },
    
    ConnectionParams : function ($scope) {
        $scope.host = '';
        $scope.username = '';
        $scope.password = '';
        $scope.appName = '';
        $scope.namespace = '';
        $scope.submit = function () {
            alert($scope.host + ', ' + $scope.username + ', ' + $scope.password + ', ' + $scope.appName + ', ' + $scope.namespace);
        };
    }
}


// What to do when document loads
$(function () {
    // Alert of initial connection
    Page.setError('<strong>Configure</strong> the system by setting <strong>connection</strong> parameters.');
});

// Get connection parameters for PaaS provider
$('#connectionParam').click(function () {
    $('#listCartridges').hide();
    $('#connectionModal').modal('show');
});

// Connect to PaaS provider and get all data
$('#reconnect').click(function () {
    $('#connection').css('color','#0d0');
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
