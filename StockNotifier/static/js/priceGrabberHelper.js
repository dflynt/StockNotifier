var helperInfo = {
    token:  "",
    stockList: "",
    stock_BuySellDict: {}
};
function APICall(stock_BuySellDict) {
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
                    var stockPrice = "";
                    if(response[key]['quote']['iexRealtimePrice'] == null) {
                        stockPrice = response[key]['quote']['latestPrice'];
                    }
                    else {
                        stockPrice = response[key]['quote']['iexRealtimePrice'];
                    }
                    if($("#" + stockSymbol).length == 0){ //if the button doesn't already exist
                        $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                        "" + stockSymbol + ": $" + stockPrice + " </button>");
                    }
                    else {
                        $("#" + stockSymbol).html(stockSymbol + ": $" + stockPrice + " ");   
                    }
                    var buyThresholdPrice;
                    var sellThresholdPrice;
                    if(typeof helperInfo.stock_BuySellDict[stockSymbol][0] !== "undefined") {
                        buyThresholdPrice = helperInfo.stock_BuySellDict[stockSymbol][0];
                    }
                    if(typeof helperInfo.stock_BuySellDict[stockSymbol][1] !== "undefined") {
                        sellThresholdPrice= helperInfo.stock_BuySellDict[stockSymbol][1];
                    }
                    var emailSent = helperInfo.stock_BuySellDict[stockSymbol].emailSent;
                    
                    if(stockPrice >= sellThresholdPrice && sellThresholdPrice != -1 && emailSent == false) {
                        helperInfo.stock_BuySellDict[stockSymbol].emailSent = true;
                        $.ajax({
                            url: "/priceThresholdMet_sendEmail",
                            type: "POST",
                            dataType: "JSON",
                            contentType: "application/json",
                            data: JSON.stringify({"token": helperInfo.token, "reason": "Sell " + stockSymbol}),
                            success: function(response) {
                                console.log(response);
                            },
                            error: function(response) {
                                console.log(response);
                            }
                        });
                    }
                    else if(stockPrice <= buyThresholdPrice && buyThresholdPrice != -1 && emailSent == false) {
                        helperInfo.stock_BuySellDict[stockSymbol].emailSent = true;
                        $.ajax({
                            url: "/priceThresholdMet_sendEmail",
                            type: "POST",
                            dataType: "JSON",
                            contentType: "application/json",
                            data: JSON.stringify({"token": helperInfo.token, "reason": "Buy " + stockSymbol}),
                            success: function(response) {
                                console.log(response);
                            },
                            error: function(response) {
                                console.log(response);
                            }
                        });
                    }
                    else {
                        //not in the buy/sell threshold so reset the variable 
                        //once it's back in the threshold, an email will be sent
                        //if statement to avoid making the write to memory
                        //it saves maybe .00001 seconds
                        if(helperInfo.stock_BuySellDict[stockSymbol].emailSent != false) {
                            helperInfo.stock_BuySellDict[stockSymbol].emailSent != false;
                        }
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
    setInterval(APICall, 7000);
}
