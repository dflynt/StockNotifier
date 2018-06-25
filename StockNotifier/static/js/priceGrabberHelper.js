function PriceGrabberHelper(stockList) {
    this.stockList = stockList;
    this.myTimer = function() {setInterval(this.apiCall, 10000)};
    this.apiCall = function() {
        var url = "https://api.iextrading.com/1.0//stock/market/batch?symbols=" +stockList+"&types=quote";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "JSON",
            contentType: "application/json",
            success: function(response) {
                for(var key in response) {
                    console.log(response[key]['quote']['symbol'] + ": $" + response[key]['quote']['iexRealtimePrice']);
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
}