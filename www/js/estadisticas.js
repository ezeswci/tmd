$(document).ready(onDeviceReady);

//Global database
//
var db;
// PhoneGap is ready
//
function onDeviceReady() {
    //Onclick CB
    //
    initClickCB();

    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";

    //Init DB
    //
    db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);

}

var maxDataOriginal = [];
var minDataOriginal = [];
var maxData = [];
var minData = [];
var maxDataG = [];
var minDataG = [];
var maxDataY = [];
var minDataY = [];
var maxDataR = [];
var minDataR = [];

function colors() {
    maxDataG = [];
    minDataG = [];
    maxDataY = [];
    minDataY = [];
    maxDataR = [];
    minDataR = [];

    for (index = 0; index < maxData.length; index++) {
        var elementmax = maxData[index];
        var elementmin = minData[index];
        var auxMax = parseInt(elementmax.y);
        var auxMin = parseInt(elementmin.y);

        if (auxMax > 140) {
            maxDataR.push(elementmax);
        }
        if (auxMax == 140) {
            maxDataY.push(elementmax);
        }
        if (auxMax < 140) {
            maxDataG.push(elementmax);
        }

        if (auxMin > 90) {
            minDataR.push(elementmin);
        }
        if (auxMin == 90) {
            minDataY.push(elementmin);
        }
        if (auxMin < 90) {
            minDataG.push(elementmin);
        }
    }
}

function cleanHist(newDate) {
    maxData = [];
    minData = [];

    for (index = 0; index < maxDataOriginal.length; index++) {
        var d = maxDataOriginal[index];
        var auxDate = new Date(d.yy, d.mm, d.dd, d.hs, d.minut, 0, 0);

        if (auxDate > newDate) {
            maxData.push(maxDataOriginal[index]);
            minData.push(minDataOriginal[index]);
        }
    }
    colors();
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
    //Select query
    //
    db.transaction(selectHist, errorCB);
}

function selectHist(tx) {
    tx.executeSql('SELECT * FROM HIST', [], querySuccess, errorCB);
}

function querySuccess(tx, rs) {
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
        maxTemp.dd = p.dd;
        maxTemp.mm = p.mm;
        maxTemp.yy = p.yy;
        maxTemp.hs = p.hs;
        maxTemp.minut = p.minut;


        minTemp.y = p.min;
        minTemp.x = i;
        minTemp.dd = p.dd;
        minTemp.mm = p.mm;
        minTemp.yy = p.yy;
        minTemp.hs = p.hs;
        minTemp.minut = p.minut;

        maxData.push(maxTemp);
        minData.push(minTemp);
    }
    maxDataOriginal = maxData;
    minDataOriginal = minData;
    colors();
}

function drawGraph() {
    //D3 settings and data
    //
    var vis = d3.select('#visualisation'),
        WIDTH = 250,
        HEIGHT = 250,
        MARGINS = {
            top: 30,
            right: 30,
            bottom: 30,
            left: 30
        },
        xRange = d3.scale.linear().range([MARGINS.left, WIDTH - MARGINS.right]).domain([d3.min(maxData, function (d) {
            return d.x;
        }), d3.max(maxData, function (d) {
            return d.x;
        })]),
        yRange = d3.scale.linear().range([HEIGHT - MARGINS.top, MARGINS.bottom]).domain([40, 270]),
        xAxis = d3.svg.axis()
        .scale(xRange)
        .tickSize(3)
        .tickSubdivide(true),
        yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(3)
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
        .interpolate('linear');

    vis.append('svg:path')
        .attr('d', lineFunc(maxData))
        .attr('stroke', '#c25dff')
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    vis.append('svg:path')
        .attr('d', lineFunc(minData))
        .attr('stroke', '#ffb33b')
        .attr('stroke-width', 3)
        .attr('fill', 'none');

    vis.selectAll("dot")
        .data(maxDataR)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "red");

    vis.selectAll("dot")
        .data(maxDataY)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "yellow");

    vis.selectAll("dot")
        .data(maxDataG)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "green");

    vis.selectAll("dot")
        .data(minDataR)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "red");

    vis.selectAll("dot")
        .data(minDataY)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "yellow");

    vis.selectAll("dot")
        .data(minDataG)
        .enter().append("circle")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return xRange(d.x);
        })
        .attr("cy", function (d) {
            return yRange(d.y);
        })
        .style("fill", "green");
}

function initClickCB() {


    $("#actual1").click(function () {

        $(".item").removeClass("actual");
        $("#actual1").addClass("actual");
        $('#visualisation').empty();
        //Substract 1 day
        var newDate = new Date(new Date().setDate(new Date().getDate() - 1));
        cleanHist(newDate);
        drawGraph();
    });
    $("#actual2").click(function () {
        $(".item").removeClass("actual");
        $("#actual2").addClass("actual");
        $('#visualisation').empty();
        //Substract 1 week
        var newDate = new Date(new Date().setDate(new Date().getDate() - 7));
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
}