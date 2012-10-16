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
    
    
    
    
    
    jsPlumb.bind("ready", function () {
        jsPlumb.setRenderMode(jsPlumb.SVG);
    
        jsPlumb.Defaults.Anchors = ["TopCenter", "TopCenter"];
        var endpoint = {
            connectorStyle:{ lineWidth:7, strokeStyle:"#bbb", dashstyle:"2 2" },
            isSource: true,
            maxConnections: 10,
            isTarget: true,
            dropOptions: {
                tolerance: "touch",
                hoverClass: "dropHover"
            }
        };

        jsPlumb.Defaults.DragOptions = {
            cursor: 'wait',
            zIndex: 20
        };
        jsPlumb.Defaults.Connector = ["Bezier", {curviness: 90}];
    
        var e1 = jsPlumb.addEndpoint("n1", endpoint);
        var e2 = jsPlumb.addEndpoint("n2", endpoint);
        
        jsPlumb.connect({
            source: e1,
            target: e2
        });
        jsPlumb.draggable(jsPlumb.getSelector(".node"));
    });
    
    
    
    
    
});
