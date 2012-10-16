/**
*
* Set UI elements for the App
*
*/

// Set the global error in the application
function setError(text) {
    $('#errorPlaceHolder').html('<div class="alert alert-error fade in">' + text
                                + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
}

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
    
    setInterval(function () {
        $("[rel=popover]").popover({
            animation: true,
            trigger: 'click',
            offset: 10,
            placement: 'top'
        }).click(function (e) { e.preventDefault(); });
    }, 1000);
    
    jsPlumb.bind("ready", function() {
        $(".node").draggable();
    });
});
