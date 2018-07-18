var helperInfo = {
    token:  "",
    stockList: "",
    stock_BuySellDict: {}
};
function APICall() {
    var graphDisplayed = false;
    if(!helperInfo.stockList == "") {
        var url = "https://api.iextrading.com/1.0//stock/market/batch?symbols=" +helperInfo.stockList+"&types=quote";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "JSON",
            contentType: "application/json",
            success: function(response) {
                for(var key in response) {
                    var openPrice = response[key]['quote']['open'];
                    var stockSymbol = response[key]['quote']['symbol'];
                    var stockPrice = "";
                    //if no current price,
                    //EX: this will be true on the weekend when markets are closed
                    if(response[key]['quote']['iexRealtimePrice'] == null) {
                        stockPrice = response[key]['quote']['latestPrice'];
                    }
                    else {
                        stockPrice = response[key]['quote']['iexRealtimePrice'];
                    }
                    if($("#" + stockSymbol).length == 0){ //if the button doesn't already exist
                        $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                        "" + stockSymbol + ": $" + stockPrice.toFixed(2) + " </button>");
                        $("#" + stockSymbol).addClass("btn btn-secondary");

                        //if statement is a simple state mechanism to display only 
                        //the first stock in the user's watchlist once the page loads
                        if(graphDisplayed == false) {
                            $("#" + stockSymbol).click();
                            graphDisplayed = true;
                        }
                    }
                    //else, update value of the already existing button
                    else {
                        $("#" + stockSymbol).html(stockSymbol + ": $" + stockPrice.toFixed(2) + " ");
                        if(stockPrice < openPrice) {
                            if($("#" + stockSymbol).attr("class") != "btn btn-danger") {
                                $("#" + stockSymbol).addClass("btn btn-danger");
                            }  
                        }
                        else {
                            if($("#" + stockSymbol).attr("class") != "btn btn-success") {
                                $("#" + stockSymbol).addClass("btn btn-success");
                            }
                        }
                    }
                    var buyThresholdPrice = helperInfo.stock_BuySellDict[stockSymbol][0];
                    var sellThresholdPrice = helperInfo.stock_BuySellDict[stockSymbol][1]
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

                            },
                            error: function(response) {
                                console.log(response);
                            }
                        });
                    }
                    //at market open, stockPrice can be 0 until data starts coming in
                    else if(stockPrice <= buyThresholdPrice && stockPrice != 0 && buyThresholdPrice != -1 && emailSent == false) {
                        helperInfo.stock_BuySellDict[stockSymbol].emailSent = true;
                        $.ajax({
                            url: "/priceThresholdMet_sendEmail",
                            type: "POST",
                            dataType: "JSON",
                            contentType: "application/json",
                            data: JSON.stringify({"token": helperInfo.token, "reason": "Buy " + stockSymbol}),
                            success: function(response) {
                            },
                            error: function(response) {
                                console.log(response);
                            }
                        });
                    }
                    else {
                        //not in the buy/sell threshold so reset the variable 
                        //once it's back in the threshold, an email will be sent
                        //the use of the if statement is to avoid making the write to memory
                        //it saves maybe .00001 seconds
                        if(helperInfo.stock_BuySellDict[stockSymbol].emailSent != false) {
                            helperInfo.stock_BuySellDict[stockSymbol].emailSent = false;
                        }
                    }
                }
                
            },
            error: function(response) {
                console.log(response);
            }
        });
    }
}

function recursiveAPICall() {
    setInterval(APICall, 7000);
}
