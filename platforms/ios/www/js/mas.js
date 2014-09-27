//Not using jQuery because this is a special event for phonegap
//If not firing with this event, phonegap plugins don't work
//
document.addEventListener("deviceready", onDeviceReady, false);

var email = "";
var startDate = new Date();
var endDate = new Date();
startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay, 0, 0, 0, 0, 0);
endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDay, 0, 0, 0, 0, 0);
var title = "Recordar tomarme la presión.";
var location_ = "";
var notes = "Recordar tomarme la presión.";
var success = function (message) {
    //    /alert("Success: " + JSON.stringify(message));
};
var error = function (message) {
    //alert("Error: " + message);
};

function onDeviceReady() {
    initClickCB();
}

function createEvent() {

    var options = {
        date: new Date(),
        mode: 'date'
    };

    datePicker.show(options, function (date) {
        var dd = date.getDate();
        var mm = date.getMonth();
        var yy = date.getFullYear();

        startDate = new Date(yy, mm, dd, 0, 0, 0, 0, 0);
        endDate = new Date(yy, mm, dd + 1, 0, 0, 0, 0, 0);
        
        window.plugins.calendar.createEvent(title, location_, notes, startDate, endDate, success, error);
    });

    cerrarVentana();
}

function sendMail() {
    //window.plugin.email.open();
}

function abrirVentana(ventana) {
    if (ventana == "1") {
        document.getElementById("cartel").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else {
        document.getElementById("cartel").style.visibility = "hidden";;
        document.getElementById("fondo_negro").style.visibility = "hidden";
    }

}

function cerrarVentana() {
    document.getElementById("cartel").style.visibility = "hidden";
    document.getElementById("fondo_negro").style.visibility = "hidden";

}

function initClickCB() {
    $("#amigo").click(sendMail);
    $("#permitir").click(createEvent);
    $("#recordatorio").click(function () {
        abrirVentana('1');
    });
    $("#x").click(cerrarVentana);

}