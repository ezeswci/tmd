$(document).ready(onDeviceReady);

// PhoneGap is ready
//
function onDeviceReady() {
    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";

    //Init DB
    //
    var db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);

    //OnClick CB
    //
    $("#guardarButton").click(
        function () {
            //SQL insert
            //
            db.transaction(insertHist, errorCB, successCB);

            //User msg
            //
            abrirVentana(1);
        });

    $("#borrarButton").click(
        function () {
            alert("Borrar");
        });
}

// Init the table
//
function initDB(tx) {
    // DROP:
    //
    //tx.executeSql('DROP TABLE IF EXISTS HIST');

    tx.executeSql('CREATE TABLE IF NOT EXISTS HIST (id unique, max, min, note, dd, mm, yy, hs, minut)');
}

function insertHist(tx) {
    //Getting data from form
    //
    var max = $("#max").val();
    var min = $("#min").val();
    var note = $("#note").val();
    var dd = 1;
    var mm = 2;
    var yy = 2014;
    var hs = 17;
    var minut = 45;

    var query = 'INSERT INTO HIST (max, min, note, dd, mm, yy, hs, minut) VALUES (?,?,?,?,?,?,?,?)';

    tx.executeSql(query, [max, min, note, dd, mm, yy, hs, minut]);
}

function selectHist(tx) {
    tx.executeSql('SELECT * FROM HIST');
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    alert("Success!");
}

// Alerts CB
//

function abrirVentana(ventana) {
    if (ventana == "1") {
        document.getElementById("cartel").style.visibility = "visible";
        document.getElementById("cartel2").style.visibility = "hidden";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else if (ventana == "2") {
        document.getElementById("cartel").style.visibility = "hidden";
        document.getElementById("cartel2").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else {
        document.getElementById("cartel").style.visibility = "hidden";
        document.getElementById("cartel2").style.visibility = "hidden";
        document.getElementById("fondo_negro").style.visibility = "hidden";
    }

}

function cerrarVentana() {
    document.getElementById("cartel").style.visibility = "hidden";
    document.getElementById("cartel2").style.visibility = "hidden";
    document.getElementById("fondo_negro").style.visibility = "hidden";

}