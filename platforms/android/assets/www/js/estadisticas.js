var maxDataOriginal = [];
var minDataOriginal = [];
var maxData = [];
var minData = [];

function cleanHist(newDate) {
    maxData = [];
    minData = [];
    alert(JSON.stringify(maxDataOriginal));
    alert(JSON.stringify(maxDataOriginal[3].date.toLocaleString()));
    alert(JSON.stringify(maxData));
    
    for (index = 0; index < maxDataOriginal.length; index++) {
        if (maxDataOriginal[index].date > newDate) {
            maxData.push(maxDataOriginal[index]);
        }
    }
    for (index = 0; index < minDataOriginal.length; index++) {
        if (minDataOriginal[index].date > newDate) {
            minData.push(minDataOriginal[index]);
        }
    }
    alert(JSON.stringify(maxData));
}

$(document).ready(onDeviceReady);

//Global database
//
var db;

// PhoneGap is ready
//
function onDeviceReady() {
    //Actual date
    //
    var d = new Date();
    var dd = d.getDay();
    var mm = d.getMonth();
    var yy = d.getFullYear();

    //Onclick CB
    //

    $("#actual1").click(function () {

        $(".item").removeClass("actual");
        $("#actual1").addClass("actual");
        $('#visualisation').empty();
        //Substract 1 day
        var newDate = new Date(new Date().setDate(new Date().getDate() - 1));
        //        alert(d);
        //        alert(newDate);
        cleanHist(newDate);
        drawGraph();
    });
    $("#actual2").click(function () {
        $(".item").removeClass("actual");
        $("#actual2").addClass("actual");
        $('#visualisation').empty();
        //Substract 1 week
        var newDate = new Date(new Date().setDate(new Date().getDate() - 7));
        //        alert(d);
        //        alert(newDate);
        cleanHist(newDate);
        drawGraph();
    });
    $("#actual3").click(function () {
        $(".item").removeClass("actual");
        $("#actual3").addClass("actual");
        $('#visualisation').empty();

        //Substract 3 weeks
        var newDate = new Date(new Date().setDate(new Date().getDate() - 21));
        cleanHist(newDate);
        drawGraph();
    });
    $("#actual4").click(
        function () {
            $(".item").removeClass("actual");
            $("#actual4").addClass("actual");
            $('#visualisation').empty();

            //Substract 1 month
            var newDate = new Date(new Date().setDate(new Date().getDate() - 30));
            cleanHist(newDate);
            drawGraph();
        });

    $("#actual5").click(
        function () {
            $(".item").removeClass("actual");
            $("#actual5").addClass("actual");
            $('#visualisation').empty();
            //Substract 1 month
            var newDate = new Date(new Date().setDate(new Date().getDate() - 90));
            cleanHist(newDate);
            drawGraph();
        });

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
    //alert("Error processing SQL: " + err);
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
    //alert("query succces");
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
        maxTemp.date = new Date(p.yy, p.mm, p.dd, p.hs, p.minut, 0, 0);

        minTemp.y = p.min;
        minTemp.x = i;
        minTemp.date = new Date(p.yy, p.mm, p.dd, p.hs, p.minut, 0, 0);

        maxData.push(maxTemp);
        minData.push(minTemp);
    }
    maxDataOriginal = maxData;
    minDataOriginal = minData;
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