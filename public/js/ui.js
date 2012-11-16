/**
*
* The View Elements relating to the App
*
*/

// Set the global error in the application
var errorQueue = [];
function setError(text) {
    errorQueue.forEach(function (ele, i, arr) {
        clearTimeout(ele);
    });
    errorQueue = [];
    $('#errorPlaceHolder').html('<div class="alert alert-error fade in"><i class="icon-exclamation-sign"></i>' + text
                                + '<a class="close" data-dismiss="alert" href="#">&times;</a></div>');
    errorQueue.push(setTimeout(function() { // Auto close error message
        $(".alert").alert('close');
    }, 10000));
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
        var isVisible = false;
        var clickedAway = false;

        $("[rel=popover]").popover({
            animation: true,
            trigger: 'click',
            offset: 10,
            placement: 'top',
            delay: { show: 500, hide: 100 }
        }).click(function (e) {
                $(this).popover('show');
                clickedAway = false
                isVisible = true
                e.preventDefault(); });


        $(document).click(function(e) {
           if(isVisible & clickedAway)
           {
               $("[rel=popover]").popover('hide')
               isVisible = clickedAway = false
           }
           else
           {
                    clickedAway = true
           }
        });

        // Make all nodes draggable
        jsPlumb.draggable($(".node"));
    }, 500);

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
