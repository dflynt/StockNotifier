$(document).ready(function() {

   var url = window.location.pathname; //returns address/dashboard/User-Token
   var token = url.split("/")[2];
   var selectedStock = ""; //used when making api call to set buy/sell threshold
   var stock_BuySellDict = {};
   $.ajax({
        url: "/getStockListForUser",
        type: "POST",
        dataType: "JSON",
        contentType: "application/json",
        data: JSON.stringify({"token": token}),
        success: function(response) {
            var stockList = "";
            $("#clientName").html("Hello, " + response[0]); //set header name
            if(response != false) {
                for(var stock = 1; stock < response.length; stock++){ //response is an array here, NOT a json object
                    stockList+=response[stock][0] + ",";
                    var buyThreshold = response[stock][1];
                    var sellThreshold = response[stock][2];
                    var arr = [buyThreshold, sellThreshold];
                    stock_BuySellDict[response[stock][0]] = arr;
                    stock_BuySellDict[response[stock][0]].emailSent = false;

                    //key is stock symbol
                    //value is array [buyPrice, sellPrice]
                }
                //remove last comma
                stockList = stockList.substring(0, stockList.length - 1); 
                //helperInfo found in priceGrabberHelper.js
                helperInfo.token = token;
                helperInfo.stockList = stockList; //make first api call when user logs in
                helperInfo.stock_BuySellDict = stock_BuySellDict;
                APICall(); //method in priceGrabberHelper.js
                recursiveAPICall(); //method in priceGrabberHelper.js
            }
        },
        error: function(response) {
            console.log(response);
        }
    });

    //function for autocomplete when searching for new stocks
    $("#autoCompleteInput").on("keyup", function(event){ 
        //keypress didn't print first value so use keyup
        var currentInput = $("#autoCompleteInput").val();
        if(currentInput.length > 0) {
            $(".stockSearchContainer").css("display", "block");
            $.ajax({
                url: "/queryDBForSecurity",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({"input":currentInput}),
                success: function(response) {
                    $("#searchResultsList").css("display", "inline");
                    $("#searchResultsList").empty();
                    for(var x = 0; x < response.length; x++) {
                        var aTag = "<li class='stockResult_li'><a href='#' id='response[x][0]'>" + response[x][1] + " (" + response[x][0] + ")</a></li>"; 
                        $("#searchResultsList").append(aTag);
                    }
                },
                error: function(response) {
                    console.log(response);
                }
            })
        }
        else {
            $(".stockSearchContainer").css("display", "none");
        }
    })

    //add symbol to watch list
    $(".stockSearchContainer ul").on("click", "li", function() {
        var value = $(this).text().split("(");
        var symbol = value[1];
        var stockSymbol = symbol.replace(")","");
        $.ajax({
            url: "/addStockToWatchList",
            type: "POST",
            dataType: "JSON",
            contentType: "application/json",
            data: JSON.stringify({"symbol": stockSymbol, "buyThreshold": -1, "sellThreshold": -1}),
            success: function(response) {
                if(helperInfo.stockList == "") { //if new list 
                    $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                    "" + stockSymbol + ": $ ...  </button>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList = response;
                    helperInfo.stock_BuySellDict[stockSymbol] = [-1, -1];
                    recursiveAPICall(); //method in priceGrabberHelper.js
                }
                else if (!helperInfo.stockList.includes(stockSymbol)){ //if symbol isn't already listed
                    $("#userStockList").append("<button type='button' class='btn btn-primary' id = " + stockSymbol + ">" + 
                    "" + stockSymbol + ": $ ... </button>");
                    $("#searchResultsList").css("display", "none");
                    $("#autoCompleteInput").val("");
                    helperInfo.stockList += "," + response;
                    helperInfo.stock_BuySellDict[stockSymbol] = [-1, -1];
                    recursiveAPICall(); //method in priceGrabberHelper.js
                }
            },
            error: function(response) {
                console.log(response);
            }
        })
    });
    
    $(document).on('click', "button", function() {
        selectedStock = this.id;
        MakeChart(this.id, "1d");
        //show form to set buy/sell threshold
    });

    $("#graphAndThresholdBtns a").on("click", function() {
        if(this.id != "setBuyThreshold" && this.id != "setSellThreshold") {
            //the buttons with these id's are a tags, we don't want those
            MakeChart(chartInfo.stockSymbol, this.id);
        }
        //Because chartInfo.stockSymbol is set to a default value
        //once the page loads It's possible to 
        //access it without it being null
    })
    $(document).on('click', '#setBuyThreshold', function() {
        var buyThreshold = $("#buyThresholdTextBox").val();
        helperInfo.stock_BuySellDict[selectedStock][0] = buyThreshold;
        helperInfo.stock_BuySellDict[selectedStock].emailSent = false;
        if (buyThreshold.length != 0) {
            $.ajax({
                url: "/setBuyThreshold",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({"token": token, "stockSymbol": selectedStock, "buyThreshold": buyThreshold}),
                success: function(response) {
                    console.log(response);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        }
    });

    $(document).on('click', "#setSellThreshold", function() {
        var sellThreshold = $("#sellThresholdTextBox").val();
        helperInfo.stock_BuySellDict[selectedStock][1] = sellThreshold;
        helperInfo.stock_BuySellDict[selectedStock].emailSent = false;
        if(sellThreshold.length != 0) {
            $.ajax({
                url: "/setSellThreshold",
                type: "POST",
                dataType: "JSON",
                contentType: "application/json",
                data: JSON.stringify({"token": token, "stockSymbol": selectedStock, "sellThreshold": sellThreshold}),
                success: function(response) {
                    console.log(response);
                },
                error: function(response) {
                    console.log(response);
                }
            });
        }
    })
});
