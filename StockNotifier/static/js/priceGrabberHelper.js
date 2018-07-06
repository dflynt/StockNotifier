var helperInfo = {
    stockList: ""
};
function APICall() {
    if(!helperInfo.stockList == "") {
        var url = "https://api.iextrading.com/1.0//stock/market/batch?symbols=" +helperInfo.stockList+"&types=quote";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "JSON",
            contentType: "application/json",
            success: function(response) {
                for(var key in response) {
                    var stockSymbol = response[key]['quote']['symbol'];
                    var stockPrice = response[key]['quote']['iexRealtimePrice'];
                    if($("#" + stockSymbol).length == 0){ //doesn't exist
                        $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                        "" + stockSymbol + ": $" + stockPrice + " </button>");
                    }
                    else {
                        $("#" + stockSymbol).html(stockSymbol + ": $" + stockPrice + " ");   

                    } 
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
    this.addToWatchList = function(stockToAdd) {
        this.stockList = this.stockList +","+stockToAdd;
    }
}

function recursiveAPICall() {
    setInterval(APICall, 1000);
}
