function MakeChart(stockSymbol) {
    var url = "https://api.iextrading.com/1.0//stock/" + stockSymbol + "/chart/1d";
    var dataPoints = [];
    $.ajax({
        url: url,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(response) {
            for(var price in response) {
                if(response[price]['high'] != -1) {
                    dataPoints.push(response[price]['high']);
                }
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
    console.log(dataPoints);
    var stockCanvas = document.getElementById("myChart");

    var myChart = new Chart(stockCanvas, {
        type: "line",   
        data: dataPoints,
        options: {
            title: {
                display: true,
                text: stockSymbol
            }
        }
    });
}
