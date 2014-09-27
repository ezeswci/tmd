document.addEventListener("deviceready", init, false);

var email = "";

var startDate = new Date(2014, 2, 15, 18, 30, 0, 0, 0);
var endDate = new Date(2014, 2, 15, 19, 30, 0, 0, 0);
var title = "My nice event";
var location_ = "Home";
var notes = "Some notes about this event.";
var success = function (message) {
    alert("Success: " + JSON.stringify(message));
};
var error = function (message) {
    alert("Error: " + message);
};

function createEvent() {
    alert("createEvent");
    window.plugins.calendar.createEvent(title, location_, notes, startDate, endDate, success, error);
    alert("createEvent!!!");
}

function sendMail() {
    window.plugin.email.open();
}

function init() {
    $("#amigo").click(sendMail);
    $("#recordatorio").click(createEvent);
}