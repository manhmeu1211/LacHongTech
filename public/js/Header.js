$(document).ready(function () {
    $("#btnChangePassword").click(function (event) {
        event.preventDefault();
        $("#changePasswordPopup").modal();
    });

    $('#close-sidebar').click(function (event) {
        event.preventDefault();
        var sate = $("#close-sidebar").attr("data-toggle")
        var table = $('#example').DataTable();
        if (sate == 'show') {
            $('#page-sidebar').removeClass('display-block');
            $('#page-sidebar').addClass('display-none');
            $('#page-content-wrapper').removeClass('width-81');
            $('#page-content-wrapper').addClass('width-100');
            table.columns.adjust();
            $("#close-sidebar").attr("data-toggle", "hide");
            $('#close-sidebar i').removeClass('fa-angle-down');
            $('#close-sidebar i').addClass('fa-angle-right');
        } else {
            $('#page-sidebar').removeClass('display-none');
            $('#page-sidebar').addClass('display-block');
            $('#page-content-wrapper').removeClass('width-100');
            $('#page-content-wrapper').addClass('width-81');
            table.columns.adjust();
            $("#close-sidebar").attr("data-toggle", "show");
            $('#close-sidebar i').removeClass('fa-angle-right');
            $('#close-sidebar i').addClass('fa-angle-down');
        }
    });
});

function fullscreen() {
    var isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
        (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
        (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
        (document.msFullscreenElement && document.msFullscreenElement !== null);

    var docElm = document.documentElement;
    if (!isInFullScreen) {
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}