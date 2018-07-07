function MakeChart(stockSymbol) {
    console.log(stockSymbol);
    var url = "https://api.iextrading.com/1.0//stock/" + stockSymbol + "/chart/1d";
    var dataPoints = [];
    var timeStamps = [];
    $.ajax({
        url: url,
        type: "GET",
        dataType: "JSON",
        contentType: "application/json",
        success: function(response) {
            var count = 0;
            for(var price in response) {
                if(response[price]['high'] != -1 && count % 5 == 0) {
                    dataPoints.push(response[price]['high']);
                    timeStamps.push(response[price]['label']);
                }
                count++;
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
    $("#myChart").remove();
    $("#myChartDiv").append('<canvas id="myChart" style="height: 400px; width: content-box;"></canvas>');
    //when I didn't remove/append a new canvas, 
    //the original would keep doubling in size on every stock button click
    var ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
          labels: timeStamps,
          datasets: [{ 
              data: dataPoints,
              label: stockSymbol,
              borderColor: "#3e95cd",
            }
          ]
        },
        options: {
          title: {
            display: true,
            text: stockSymbol
          },
          responsive: true,
          maintainAspectRatio: false,
        }
      });
}
