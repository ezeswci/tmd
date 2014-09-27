$(document).ready(onDeviceReady);
var db;
var d = new Date();
// PhoneGap is ready
//
function onDeviceReady() {
    $("#aclaracion_max").hide();
    $("#aclaracion_min").hide();

    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";

    //Init DB
    //
    db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);

    initClickCB();
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
    var max = $("#max").val();
    var min = $("#min").val();
    var note = $("#note").val();
    var dd = d.getDate();
    var mm = d.getMonth();
    var yy = d.getFullYear();
    var hs = d.getHours();
    var minut = d.getMinutes();

    var query = 'INSERT INTO HIST (max, min, note, dd, mm, yy, hs, minut) VALUES (?,?,?,?,?,?,?,?)';

    tx.executeSql(query, [max, min, note, dd, mm, yy, hs, minut]);

    cleanForm();
    //User msg
    //
    abrirVentana(1);
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    //alert("Success!");
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

function dateParser(dd, mm, yy, hs, minut) {
    mm = mm + 1;
    return dd + "-" + mm + "-" + yy + " " + hs + ":" + minut + "hs";
}

function cleanForm() {
    $("#max").text("---");
    $("#min").text("---");
    $("#note").text("---");
    $("#max").val("---");
    $("#min").val("---");
    $("#note").val("---");
    $("#datetime").text("dd-mm-aa hh:mm");
    $("#aclaracion_max").hide();
    $("#aclaracion_min").hide();
}

function verif() {
    var max = $("#max").val();
    var min = $("#min").val();
    var note = $("#note").val();
    var datetime = $("#datetime").text();
    if (datetime == "dd-mm-aa hh:mm") {
        alert("Debes ingresar una fecha.");
        return false;
    }

    if (max == "" || min == "" || max == "---" || min == "---" || max == null || min == null) {
        $("#aclaracion_max").show();
        $("#aclaracion_min").show();

        return false;
    } else {

        //MAX (sistólica) – entre 70 y 270 mmHg
        //MIN (diastólica) – entre 40 y 140 mmHg
        if (max < 70 || max > 270) {
            $("#aclaracion_max").show();
            return false;
        }

        if (min < 40 || min > 140) {
            $("#aclaracion_min").show();
            return false;
        }

    }

    return true;
}

function initClickCB() {
    //OnClick CB
    //
    $(".i").click(function () {
        abrirVentana('2');
    });
    $("#x").click(function () {
        cerrarVentana();
    });
    $("#max").focus(function () {
        $("#max").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });
    $("#min").focus(function () {
        $("#min").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });

    $("#note").focus(function () {
        $("#note").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });

    $("#guardarButton").click(
        function () {
            if (verif()) {
                //SQL insert
                //
                db.transaction(insertHist, errorCB, successCB);
            }
        });

    $("#borrarButton").click(
        function () {
            cleanForm();
        });

    $(".fecha").click(
        function () {
            var options = {
                date: new Date(),
                mode: 'datetime'
            };

            datePicker.show(options, function (date) {
                d = date;
                var dd = d.getDate();
                var mm = d.getMonth();
                var yy = d.getFullYear();
                var hs = d.getHours();
                var minut = d.getMinutes();
                var auxString = dateParser(dd, mm, yy, hs, minut);
                $("#datetime").text(auxString);
            });
        });
}