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
    window.plugins.Calendar.createEvent(title, location_, notes, startDate, endDate, success, error);
    alert("createEvent!!!");
}

function sendMail() {
    alert("send_mails");
    window.plugin.email.isServiceAvailable(
        function (isAvailable) {
            if (isAvailable) {
                window.plugin.email.open(
                    //                {to: ['max.mustermann@appplant.de'],
                    //                cc: ['erika.mustermann@appplant.de'],
                    //                bcc: ['john.doe@appplant.com', 'jane.doe@appplant.com'],
                    //                subject: 'Greetings',
                    //                body: 'How are you? Nice greetings from Leipzig'}
                );
            } else {
                alert("No hay una aplicación de email disponible.");
            }
        }
    );
}

function init() {
    $("#amigo").click(sendMail);
    $("#recordatorio").click(createEvent);
    //alert("init");
}

$(document).ready(init);