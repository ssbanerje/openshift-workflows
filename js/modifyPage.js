// Set the alert field of the page
function SetError(text) {
    $('#errorPlaceHolder').html('<a class="close" data-dismiss="alert" href="#">&times;</a>'+text);
    if(!$('#errorPlaceHolder').is(":visible")) {
        $('#errorPlaceHolder').show();
    }
}