var maxData = [];
var minData = [];

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
    tx.executeSql('CREATE TABLE IF NOT EXISTS HIST (id unique, max, min, note)');
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
    //Select query
    //
    db.transaction(selectHist, errorCB);
}

function selectHist(tx) {
    tx.executeSql('SELECT * FROM HIST', [], querySuccess, errorCB);
}

function querySuccess(tx, rs) {
    alert("query succces");
    // this will be empty since no rows were inserted.
    buildGraphHist(rs);
    drawGraph();
}

function buildGraphHist(rs) {
    for (var i = 0; i < rs.rows.length; i++) {
        var p = rs.rows.item(i);

        var maxTemp = new Object();
        var minTemp = new Object();

        maxTemp.y = p.max;
        maxTemp.x = i;

        minTemp.y = p.min;
        minTemp.x = i;

        maxData.push(maxTemp);
        minData.push(minTemp);
    }
}

function drawGraph() {
    //D3 settings and data
    //
    var vis = d3.select('#visualisation'),
        WIDTH = 200,
        HEIGHT = 200,
        MARGINS = {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(maxData, function (d) {
            return d.x;
        }), d3.max(maxData, function (d) {
            return d.x;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([d3.min(maxData, function (d) {
            return d.y;
        }), d3.max(maxData, function (d) {
            return d.y;
        })]),
        xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(5)
        .tickSubdivide(true),
        yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(5)
        .orient('left')
        .tickSubdivide(true);

    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis);

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);

    var lineFunc = d3.svg.line()
        .x(function (d) {
            return xRange(d.x);
        })
        .y(function (d) {
            return yRange(d.y);
        })
        .interpolate('basis');

    vis.append('svg:path')
        .attr('d', lineFunc(maxData))
        .attr('stroke', 'blue')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
    
    vis.append('svg:path')
        .attr('d', lineFunc(minData))
        .attr('stroke', 'red')
        .attr('stroke-width', 2)
        .attr('fill', 'none');
}