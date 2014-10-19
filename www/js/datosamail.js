$(document).ready(onDeviceReady);

//Global database
//
var db;

// PhoneGap is ready
//
function onDeviceReady() {
    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";

    //Init DB
    //
    db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);

}

// Init the table
//
function initDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS HIST (id unique, max, min, note, dd, mm, yy, hs, minut)');
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
    //Select query
    //
    db.transaction(selectHist, errorCB);
}

function selectHist(tx) {
    tx.executeSql('SELECT * FROM HIST', [], querySuccess, errorCB);
}

function querySuccess(tx, rs) {
    // this will be empty since no rows were inserted.

    for (var i = 0; i < rs.rows.length; i++) {
        var p = rs.rows.item(i);

        var element = parseHistSelect(p.min, p.max, p.note, p.dd, p.mm, p.yy, p.hs, p.minut);
        //alert(element);
        $("#resumen_oculto").append(element);
    }
}

function parseHistSelect(min, max, note, dd, mm, yy, hs, minut) {
if(note == "" || note == null || note == "---") {
    return dd + '-' + mm + '-' + yy + ' ' + hs + ':' + minut + ',' + max + ' / ' + min + ', ,'+"\n";
    
} else {
    return dd + '-' + mm + '-' + yy + ' ' + hs + ':' + minut + ',' + max + ' / ' + min + ',' + note + "\n";
}
}
function sendMailDatos() {
	var datos="data:text/csv;charset=utf-8,Fecha,Medicion,Nota,\n";
	datos+=document.getElementById("resumen_oculto").innerHTML;
	var enc = window.btoa(datos);
	window.plugin.email.open({
	subject:     'Mis Datos, App Presión',
    attachments: ['base64:misdatospresion.csv//'+enc]
});
}