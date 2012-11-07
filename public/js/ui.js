/**
*
* The View Elements relating to the App
*
*/

// Set the global error in the application
function setError(text) {
    $('#errorPlaceHolder').html('<div class="alert alert-error fade in"><i class="icon-exclamation-sign"></i>' + text
                                + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
}

// Main!
$(function () {
    // Show Cartridges
    $(document).on('click', '#showCartridges', function () {
        $('#listCartridges').slideToggle('fast', function () {
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

    // All features for node tags
    $(document).on('mouseenter', '.node', function () {
        $(this).find('.controller').show();
    });
    $(document).on('mouseleave', '.node', function () {
        $(this).find('.controller').hide();
    });

    setInterval(function () {
        // Enable popovers
        $("[rel=popover]").popover({
            animation: true,
            trigger: 'click',
            offset: 10,
            placement: 'top',
            delay: { show: 500, hide: 100 }
        }).click(function (e) { e.preventDefault(); });

        // Make all nodes draggable
        jsPlumb.draggable($(".node"));
    }, 500);

    // Get connection parameters for PaaS provider
    $('.connectionParam').click(function () {
        $('#connectionModal').modal('show');
    });

    jsPlumb.bind("ready", function () {
        jsPlumb.setRenderMode(jsPlumb.SVG);
        jsPlumb.importDefaults({
			PaintStyle: { lineWidth: 4, strokeStyle: "#ddd" },
			Endpoint: [ "Dot", { radius: 6 } ],
			EndpointStyle: { fillStyle: "#dde", strokeStyle: "#111" },
            DragOptions: { cursor: 'wait', zIndex: 20 },
            Connector: ["Bezier", {curviness: 90}]
        });
    });
});
