OpenShiftWorkflows = {
    setError : function SetError(text) {
        $('#errorPlaceHolder').html('<a class="close" data-dismiss="alert" href="#">&times;</a>'+text);
        if(!$('#errorPlaceHolder').is(":visible")) {
            $('#errorPlaceHolder').show();
        }
    },
    
    setCartridges : function(json) {
        $('#cartridges').show();
    }
}



// What to do when document loads
$(document).ready(function () {
    // Alert of initial connection
    OpenShiftWorkflows.setError('<strong>Configure</strong> the system by setting <strong>connection</strong> parameters.');
    OpenShiftWorkflows.setCartridges(null);
});

// Get connection parameters for PaaS provider
$('#connectionParam').click(function () {
    $('#listCartridges').hide();
    $('#connectionModal').modal('show');
});

// Reconnect to PaaS provider
$('#reconnect').click(function () {
    // Reconnect to host
});

// Show Cartridges
$('#showCartridges').click(function () {
    $('#listCartridges').slideToggle('slow', function () {
        if($(this).is(":hidden")) {
            $('span').html('<i class="icon-chevron-up"></i>');
        } else {
            $('span').html('<i class="icon-chevron-down"></i>');
        }
    });
});
