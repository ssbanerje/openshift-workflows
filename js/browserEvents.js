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