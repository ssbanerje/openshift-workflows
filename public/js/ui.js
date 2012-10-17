/**
*
* The View Elements relating to the App
*
*/

// Set the global error in the application
function setError(text) {
    $('#errorPlaceHolder').html('<div class="alert alert-error fade in">' + text
                                + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
}

// Main!
$(function () {
    setInterval(function () {
        // Enable popovers
        $("[rel=popover]").popover({
            animation: true,
            trigger: 'click',
            offset: 10,
            placement: 'top'
        }).click(function (e) { e.preventDefault(); });
        
        // All features for node tags
        $('.node').hover(function () {
            $(this).find('.controller').show();
        }, function () {
            $(this).find('.controller').hide();
        });
        
        // Make all nodes draggable
        jsPlumb.draggable(jsPlumb.getSelector(".node"));
    }, 500);
    
    // Get connection parameters for PaaS provider
    $('.connectionParam').click(function () {
        $('#connectionModal').modal('show');
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
    
    jsPlumb.bind("ready", function () {
        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.Defaults.DragOptions = {
            cursor: 'wait',
            zIndex: 20
        };
        jsPlumb.Defaults.Connector = ["Bezier", {curviness: 90}];
    });
});
