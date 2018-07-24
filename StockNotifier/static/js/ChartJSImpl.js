var chartInfo = {
    stockSymbol: "",
    firstRequest: true, //maintains state - if true, get chart history, if false, get single price
    url: "https://api.iextrading.com/1.0//stock/",
    chartInterval_1day: "/chart/1d",
    chartInterval_1month: "/chart/1m",
    chartInterval_3month: "/chart/3m",
    chartInterval_1year: "/chart/1y",
    chartInterval_5year: "/chart/5y",
    currentPrice: "/price",
    requestInterval: 1, //if requestInterval % 3 == 0, append new datapoint to graph in updateGraph()
                        
    
}
var lineGraph = null;
function MakeChart(stockSymbol, intervalChoice) {
    var url = chartInfo.url + stockSymbol;
    chartInfo.stockSymbol = stockSymbol;
    switch(intervalChoice) {
        case("1d"):
            url += chartInfo.chartInterval_1day;
            break;
        case("1m"):
            url += chartInfo.chartInterval_1month;
            break;
        case("3m"):
            url += chartInfo.chartInterval_3month;
            break;
        case("6m"):
            url += chartInfo.chartInterval_6month;
            break;
        case("1y"):
            url += chartInfo.chartInterval_1year;
            break;
        case("5y"):
            url += chartInfo.chartInterval_5year;
            break;    
    }
    helperInfo.stockSymbol = stockSymbol;
    var dataPoints = [];
    var timeStamps = [];
    var color; //hexcode for green
    var openPrice;
    $.ajax({
        url: url + chartInfo.currentPrice,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(response) {
            for(var price in response ) {
                if(response[price]['high'] != -1) {
                    dataPoints.push(response[price]['high']);
                    timeStamps.push(response[price]['label']);
                }
            }
            openPrice = dataPoints[0];
            // It's possible to hardcode the 0th-index access beccause
            // the open price isn't changing throughout the day
            if(openPrice < dataPoints[dataPoints.length - 1]) { 
                //in the positive, line color is green
                color = "#08af08";
            }
            else {
                color = "#f0372d";
            }  
            //remove and append removes the previous canvas
            //this allows a new graph to be displayed on  the same canvas
            $("canvas#myChart").remove();
            $("div#myChartDiv").append('<canvas id="myChart" height="400"></canvas>');
            var ctx = document.getElementById("myChart").getContext("2d");
            lineGraph = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: timeStamps,
                  datasets: [{ 
                      data: dataPoints,
                      label: stockSymbol,
                      borderColor: color,
                      fill: false
                    }
                  ]
                },
                options: {
                  title: {
                    display: true,
                    text: stockSymbol,
                    fontsize: 50
                  },
                  scales: {
                    xAxes: {
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 15
                        }
                    },   
                  },
                  legend: {
                      display: false
                  },
                  annotation: {
                    annotations: [{
                      type: 'line',
                      mode: 'horizontal',
                      scaleID: 'y-axis-0',
                      value: openPrice,
                      borderColor: 'rgb(75, 192, 192)',
                      borderWidth: 4,
                    }]
                  },
                  elements: {
                    point: {
                        radius: 2.5 // disables bezier curves
                    },
                    line: {
                        tension: 0
                    }
                 },
                  responsive: true,
                  maintainAspectRatio: false,
                }
              });
        },
        error: function(response) {
            console.log(response);
        }
    });
    var date = new Date();
    var period = "";
    var hour = date.getHours();
    var minute = date.getMinutes();
    if((hour >= 16 && minute >= 30) || hour > 16) { //if market closed
        // || statement to account for time before 4:30
        return;
    }
    else if(intervalChoice === "1d"){
        recursiveUpdateGraph();
    }
}

function updateGraph() {
    var graph = lineGraph;
    console.log(chartInfo.url + chartInfo.stockSymbol + chartInfo.currentPrice);
    $.ajax({
        url: chartInfo.url + chartInfo.stockSymbol + chartInfo.currentPrice,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(response) {
            chartInfo.requestInterval++;
            if(chartInfo.requestInterval % 3 == 0) {
                var date = new Date();
                var period = "";
                var hour = date.getHours();
                if(hour > 12) {
                    hour = hour - 12;
                    period = "pm";
                }
                else {
                    period = "am"
                }
                var minute = date.getMinutes();
                if(minute.toString().length == 1) {
                    minute = "0" + minute;
                }
                var time = hour + ":" + minute + " " + period;
                graph.data.datasets[0].data.push(response);
                graph.data.labels.push(time);
                graph.update();
            }
        },
        error: function(response) {
            console.log(response);
        }
    });    
}

function recursiveUpdateGraph() {
    setInterval(updateGraph, 60000);
}

