$(document).ready(onDeviceReady);
//var devicePlatform = device.platform;// - "Android" - "iOS"
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
var dateLabel = [];

function colors() {
    maxDataG = [];
    minDataG = [];
    maxDataY = [];
    minDataY = [];
    maxDataR = [];
    minDataR = [];
	// Para leer las cantidades
	document.getElementById("cant_med_tot").innerHTML = maxData.length;
	// Fin de primera parte de leo las cantidades
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
	// Le pongo aca lo de las cantidades segunda parte
	document.getElementById("cant_med_max").innerHTML = maxDataR.length;
    document.getElementById("cant_med_min").innerHTML = minDataR.length;
	// Fin de segunda parte de leo las cantidades
}

function cleanHist(newDate) {
    maxData = [];
    minData = [];
    dateLabel = [];
    //alert(newDate);
    var dd;
    var mm;
    var yy;
    var hs;
    var minut;
    var index_aux = 0;
	//alert(newDate);
    //alert(maxDataOriginal.length);
    for (index = 0; index < maxDataOriginal.length; index++) {
        var d = maxDataOriginal[index];
		// En el registro esta guardado los meses bien, y el date lleva uno menos
        var auxDate = new Date(d.yy, (d.mm-1), d.dd, d.hs, d.minut, 0, 0);
		//alert(d+"-Fecha:-"+auxDate);
        if (auxDate > newDate) {
            maxDataAux = maxDataOriginal[index];
            minDataAux = minDataOriginal[index];
            //This index reasings the domain value
            //It starts from zero again and plus 1 just when i add any element to the array
            //and it's diferent from the for index.
            maxDataAux.x = index_aux;
            minDataAux.x = index_aux;
            maxData.push(maxDataAux);
            minData.push(minDataAux);
            
            dd = maxDataOriginal[index].dd;
            mm = maxDataOriginal[index].mm;
            yy = maxDataOriginal[index].yy;
            hs = maxDataOriginal[index].hs;
            minut = maxDataOriginal[index].minut;
            
            dateLabel.push(dateParser(dd, mm, yy, hs, minut));
            index_aux = index_aux + 1;
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
    tx.executeSql('SELECT * FROM HIST ORDER BY yy,mm,dd,hs,minut', [], querySuccess, errorCB);
}

function querySuccess(tx, rs) {
    //One week is inital filter
    $("#actual2").addClass("actual");
    $('#visualisation').empty();
    //Substract 1 week
    var newDate = new Date(new Date().setDate(new Date().getDate() - 7));
	//alert(newDate);
    buildGraphHist(rs);
    cleanHist(newDate);
    // this will be empty since no rows were inserted.
    drawGraph();
}

function buildGraphHist(rs) {
    dateLabel = [];

    for (var i = 0; i < rs.rows.length; i++) {
        var p = rs.rows.item(i);
        var maxTemp = new Object();
        var minTemp = new Object();
        var dateTemp = new Date(p.yy, p.mm, p.dd, p.hs, p.minut);
        //alert(dateTemp);
        maxTemp.y = p.max;
        maxTemp.x = i;
        maxTemp.dd = p.dd;
        maxTemp.mm = p.mm;
        maxTemp.yy = p.yy;
        maxTemp.hs = p.hs;
        maxTemp.minut = p.minut;
		
		if(p.max==p.min){minTemp.y = p.min-7;}
        else{minTemp.y = p.min;}
        minTemp.x = i;
        minTemp.dd = p.dd;
        minTemp.mm = p.mm;
        minTemp.yy = p.yy;
        minTemp.hs = p.hs;
        minTemp.minut = p.minut;

        //This little bullshit is a tagging array for x axis
        //
        dateLabel.push(dateParser(p.dd, p.mm, p.yy, p.hs, p.minut));

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
        WIDTH = 275,
        HEIGHT = 275,
        MARGINS = {
            top: 30,
            right: 25,
            bottom: 30,
            left: 45
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
        .tickFormat(function (x) {
            return dateLabel[x];
        }),
        yAxis = d3.svg.axis()
        .scale(yRange)
        .tickSize(3)
        .orient('left')
        .tickSubdivide(true);
	// Grosor
	vis.style("stroke-width", 1);
	
    vis.append('svg:g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + (HEIGHT - MARGINS.bottom) + ')')
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
            return "rotate(-65)"
        });

    vis.append('svg:g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + (MARGINS.left) + ',0)')
        .call(yAxis);
		
		vis.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 )
        .attr("x", -100 )
        .attr("dy", "1em")
        .text("Presión Arterial (mmHg)");

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

function mostrarDatos() {
    
}
function parMes(mes){
	if(mes==1){return 'ene';}
	if(mes==2){return 'feb';}
	if(mes==3){return 'mar';}
	if(mes==4){return 'abr';}
	if(mes==5){return 'may';}
	if(mes==6){return 'jun';}
	if(mes==7){return 'jul';}
	if(mes==8){return 'ago';}
	if(mes==9){return 'sep';}
	if(mes==10){return 'oct';}
	if(mes==11){return 'nov';}
	if(mes==12){return 'dic';}
}
function parAno(ano){
	return (ano-2000);
}
function dateParser(dd, mm, yy, hs, minut) {
    //mm = mm + 1; No entiendo para que agregas esto
    return dd + "-" + parMes(mm) + "-" + parAno(yy);
	//return dd + "-" + mm + "-" + yy + " " + hs + ":" + minut + "hs";
}
function alerta(txt){
var iframe = document.createElement("IFRAME");
iframe.setAttribute("src", 'data:text/plain,');
document.documentElement.appendChild(iframe);
window.frames[0].window.alert(txt);
iframe.parentNode.removeChild(iframe);
}
