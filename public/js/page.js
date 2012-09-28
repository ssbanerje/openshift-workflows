OpenShift_Workflows = {
    setError : function SetError(text) {
        $('#errorPlaceHolder').html('<div class="alert alert-error fade in">'+text+'<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    },
    
    setCartridges : function(json) {
        $('#cartridges').show();
    }
}



// What to do when document loads
$(document).ready(function () {
    // Alert of initial connection
    OpenShift_Workflows.setError('<strong>Configure</strong> the system by setting <strong>connection</strong> parameters.');
    OpenShift_Workflows.setCartridges(null);
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
